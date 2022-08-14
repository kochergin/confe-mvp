require('marko/node-require').install();
require('marko/express'); //enable res.marko

var Express = require('express');
var BrowserFingerprint = require('browser_fingerprint')
var path = require('path');
var Formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');
var Primus = require('primus');
var striptags = require('striptags');
var CronJob = require('cron').CronJob;
var ics = require('ics');
var moment = require('moment');
moment.locale('ru');

var database = require('./mongodb-database-v2.js');

var app = Express();
var port = 80;

//var isProduction = process.env.NODE_ENV === 'production';
var isProduction = true;

var allowedTags = [ 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'sub', 'sup' ];

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
require('lasso').configure({
    // if we will need babel transforms then do this: "npm i @babel/core @babel/preset-env lasso-babel-transform"
    // then uncomment this:
    /*require: {
        transforms: [
            {
                transform: 'lasso-babel-transform',
                config: {
                    extensions: ['.js', '.es6'] // Enabled file extensions. Default: ['.js', '.es6']
                }
            }
        ]
    },*/
	plugins: [
		'lasso-sass',
		'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
	],
	outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
	bundlingEnabled: isProduction, // Only enable bundling in production
	minify: isProduction, // Only minify JS and CSS code in production
	fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
	bundles: [
		{
			// Name of the bundle (used for determining the output filename)
			"name": "conference",

			// Set of dependencies to add to the bundle
			"dependencies": [
				"./styles/js-detect.css",
				"./scripts/js-detect.js",
				"./scripts/misc.js",
				//"./scripts/bootstrap.native.js",
				"jquery/dist/jquery.js",
				"popper.js/dist/umd/popper.js",
				"bootstrap/js/dist/util.js",
				"bootstrap/js/dist/collapse.js",
				"bootstrap/js/dist/modal.js",
				"bootstrap/js/dist/dropdown.js",
				"./scripts/primus.js",
				"./styles/bootstrap.scss",
				"./styles/misc.css"
			]
		},
		{
			"name": "moment",
			"dependencies": [
				"moment/moment.js",
				"moment/locale/ru.js"
			]
		}
	]
});

const fingerprinter = new BrowserFingerprint({
	onlyStaticElements: true
});

app.use(function(req, res, next) {
	let {fingerprint, elementHash, headersHash} = fingerprinter.fingerprint(req);
	req.fingerprint = fingerprint;
	res.set(headersHash);
	next();
});

app.use(require('lasso/middleware').serveStatic());

app.use(Express.static('public'));

function broadcastScheduleUpdate( fingerprint ) {
	database.getAdminSchedule(fingerprint, function(admin_err, admin_ok, new_admin_schedule) {
		if(!admin_ok) {
			console.error(admin_err);
			return;
		}

		console.log('broadcasting updated admin schedules');

		primus.forEach(function(broadcast_spark) {
			// administrators get 2 copies of updated schedule
			if( ( database.isAdmin(broadcast_spark.query.fingerprint) || database.isMod(broadcast_spark.query.fingerprint) ) && broadcast_spark.query.page == 'schedule-admin' ) {
				broadcast_spark.write({
					message_type: 'admin/schedule',
					admin_schedule: new_admin_schedule,
				});
			}
		});
	});

	database.getSchedule(fingerprint, function(user_err, user_ok, new_user_schedule) {
		if(!user_ok){
			console.error(user_err);
			return;
		}

		console.log('broadcasting updated user schedules');

		primus.forEach(function(broadcast_spark) {
			if( broadcast_spark.query.page == 'schedule' ) {
				broadcast_spark.write({
					message_type: 'schedule',
					schedule: new_user_schedule,
				});
			}
		});
	});

	database.getExtraSchedule(fingerprint, function(extra_err, extra_ok, new_extra_schedule) {
		if(!extra_ok){
			console.error(extra_err);
			return;
		}

		console.log('broadcasting updated extra schedules');

		primus.forEach(function(broadcast_spark) {
			if( broadcast_spark.query.page == 'info' ) {
				broadcast_spark.write({
					message_type: 'extra_schedule',
					extra_schedule: new_extra_schedule,
				});
			}
		});
	});
}

function broadcastFlightsUpdate( fingerprint ) {
	database.getFlights(fingerprint, function(err, ok, new_flights_info) {
		if(!ok) {
			console.error(err);
			return;
		}

		console.log('broadcasting updated flight info');

		primus.forEach(function(broadcast_spark) {
			if( broadcast_spark.query.page == 'info' ) {
				broadcast_spark.write({
					message_type: 'info/flights',
					flights: new_flights_info,
				});
			}
		});
	});
}

function broadcastContactsUpdate( fingerprint ) {
	database.getContacts(fingerprint, function(err, ok, new_contacts_info) {
		if(!ok) {
			console.error(err);
			return;
		}

		console.log('broadcasting updated contact info');

		primus.forEach(function(broadcast_spark) {
			if( broadcast_spark.query.page == 'info' ) {
				broadcast_spark.write({
					message_type: 'info/contacts',
					contacts: new_contacts_info,
				});
			}
		});
	});
}

function broadcastSpeakersUpdate( fingerprint ) {
	database.getSpeakers(fingerprint, function(err, ok, updated_speakers) {
		console.log('broadcasting updated speakers');

		primus.forEach(function(broadcast_spark) {
			broadcast_spark.write({
				message_type: 'speakers',
				speakers: updated_speakers,
			});
		});
	});
}

app.locals.current_event_id = null;
app.locals.current_event_last_change = null;
app.locals.next_event_id = null;
app.locals.next_event_last_change = null;
app.locals.holding_event = null;
function checkCurrentStateUpdate(eventData) {
    // return true (update broadcast needed):
    if( eventData.current_event ) {
        // if current event id changed
        if( app.locals.current_event_id != ''+eventData.current_event._id ) {
            console.log('current event\'s id changed');
            return true;
        }

        // if current event last_change timestamp changed
        if( app.locals.current_event_last_change != eventData.current_event.last_change ) {
            console.log('current event\'s last change timestamp changed');
            return true;
        }
    } else {
        if( app.locals.current_event_id ) {
            console.log('no current event');
            return true;
        }
    }

    if( eventData.next_event ) {
        // if next event's id changed
        if( app.locals.next_event_id != ''+eventData.next_event._id ) {
            console.log('next event\'s id changed');
            return true;
        }

        // if next event's last_change timestamp changed
        if( app.locals.next_event_last_change != eventData.next_event.last_change ) {
            console.log('next events\'s last change timestamp changed');
            return true;
        }
    } else {
        if( app.locals.next_event_id ) {
            console.log('no next event');
            return true;
        }
    }

    return false;
}

function updateCurrentState(eventData) {
    // return true (update broadcast needed):
    if( eventData.current_event ) {
        app.locals.current_event_id = ''+eventData.current_event._id;
        app.locals.current_event_last_change = eventData.current_event.last_change;
    } else {
        app.locals.current_event_id = null;
        app.locals.current_event_last_change = null;
    }

    if( eventData.next_event ) {
        app.locals.next_event_id = ''+eventData.next_event._id;
        app.locals.next_event_last_change = eventData.next_event.last_change;
    } else {
        app.locals.next_event_id = null;
        app.locals.next_event_last_change = null;
    }

    return true;
}

function broadcastCurrentEventUpdate(hold_current_event, cb) {
	let current_timestamp = Date.now();

	let db_timestamp = current_timestamp;
	if (app.locals.holding_event && typeof hold_current_event !== 'boolean') {
		db_timestamp = app.locals.holding_event;
	}

    database.getCurrentEventData(
        null,
        db_timestamp,
        function( err, ok, eventData ) {
			let updateNeeded = checkCurrentStateUpdate(eventData);
			let holdChanged = typeof hold_current_event === 'boolean' && hold_current_event != !!app.locals.holding_event;

            if(!updateNeeded && !holdChanged) {
				( typeof cb == "function" ) && cb(false);
                return;
            }

            console.log('current event data needs updating');
			updateCurrentState(eventData);

			if (holdChanged) {
				console.log('hold status changing');

				if(hold_current_event) { // putting current event on hold
					app.locals.holding_event = current_timestamp;
				} else { // continue the flow:
					app.locals.holding_event = null;
				}
			}

            if(eventData) {
				if (eventData.current_event) {
					eventData.message_type = 'current_event';

					if (app.locals.holding_event) {
						let eventDataTemplate = database.getCurrentEventDataTemplate(current_timestamp, eventData.settings.timezone);

						// we have to rewrite the data we got from db (since it's forged) and replace it with actual values
						Object.assign(eventData, eventDataTemplate);

						eventData.holding_current_event = true;
					}
				} else {
					eventData.message_type = 'no_current_event';
				}
            } else {
                eventData = {
                    message_type: 'no_current_event',
                    current_event: null,
                    next_event: null,
                };
			}

			let current_questions = eventData.current_questions || [];

            // broadcast event updates for "now" page
            primus.forEach(function(broadcast_spark) {
                if( broadcast_spark.query.page == 'now' ) {
					if (current_questions.length) {
						let user_questions = current_questions
							.filter((q) => q.user_id == broadcast_spark.query.fingerprint || q.status != 'new')
							.map((q) => {q.owned = q.user_id == broadcast_spark.query.fingerprint; return q;});
						eventData.current_questions = user_questions;
					}

					eventData.fingerprint = broadcast_spark.query.fingerprint;
                    broadcast_spark.write(eventData);
                }
            });

            // broadcast event updates for "mod" page
            database.getCurrentModEventData(
                null,
                db_timestamp,
                function( err, ok, eventData ) {
                    if(eventData) {
						if (eventData.current_event) {
							eventData.message_type = 'mod_event';

							if (app.locals.holding_event) {
								let eventDataTemplate = database.getCurrentEventDataTemplate(current_timestamp, eventData.settings.timezone);
		
								// we have to rewrite the data we got from db (since it's forged) and replace it with actual values
								Object.assign(eventData, eventDataTemplate);

								eventData.holding_current_event = true;
							}
						} else {
							eventData.message_type = 'no_current_event';
						}
                    } else {
                        eventData = {
                            message_type: 'no_current_event',
                            current_event: null,
                            next_event: null,
                        };
                    }

                    primus.forEach(function(broadcast_spark) {
                        if( broadcast_spark.query.page == 'mod' && database.isMod(broadcast_spark.query.fingerprint) ) {
                            eventData.fingerprint = broadcast_spark.query.fingerprint;
                            broadcast_spark.write(eventData);
                        }
					});
					
					( typeof cb == "function" ) && cb(true);
                }
            );
        }
    );
};

var rgxpr = /^(www\.)?(ruc2019\.ru|ruc2018\.ru)$/;
function handleRedirect(req, res, next) {
    if ( typeof req.headers.host === "undefined" || req.headers.host.match(rgxpr) !== null )
        res.redirect(301, 'http://roxarconference.ru' + req.url);
    else
        next();
}
app.get('*', handleRedirect);

app.post('/upload', function(req, res) {
	if( !database.isAdmin(req.fingerprint) ) {
		res.status(403).json({
			message_type: 'error',
			text: 'Ошибка: вам запрещён доступ к данной странице.',
		});
		return;
	}

	// create an incoming form object
	var form = new Formidable.IncomingForm();

	form.multiples = false;
	form.maxFileSize = 5 * 1024 * 1024; // 5 MB
	form.hash = 'sha1';

	// store all uploads in the /uploads directory
	form.uploadDir = path.join(__dirname, '/public/photos');

	// allow only certain extensions
	form.onPart = function (part) {
		if(!part.filename || part.filename.match(/\.(jpg|jpeg|png)$/i)) {
			this.handlePart(part);
		}
		else {
			console.log(part.filename + ' is not allowed');
		}
	};

	// log any errors that occur
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});

	// parse the incoming request containing the form data
	form.parse(req, function(err, fields, files) {
		if( err ) {
			res.json({
				message_type: 'error',
				text: 'Ошибка! Проверьте, что вы загружаете правильный тип файла (jpg или png) и его размер не превышает 5 МБ.',
			});
			return;
		}

		let speaker_data = fields;

		for (var property in files) {
			if (files.hasOwnProperty(property)) {
				if( property == 'photo' || files[property].size <= 0 || !files[property].name ) {
					let extension = path.extname( files['photo'].name ).toLowerCase();
					// only allow jpg or png images
					if( extension == '.jpg' || extension == '.jpeg' || extension == '.png' ) {
						let new_filename = files['photo'].hash+path.extname(files['photo'].name);
						let new_path = path.join(form.uploadDir, new_filename);
						if( fs.existsSync(new_path) ) {
							// file already exists, delete uploaded file
							console.log('upload warning: file already exists on the server, just use the existing one');
							fs.unlink( files['photo'].path, function(err){} );
						} else {
							fs.renameSync( files['photo'].path, new_path );
						}

						speaker_data['photo_path'] = new_filename;
					} else {
						console.error('upload error: file does not have jpg and/or png extension');
						fs.unlink( files[property].path, function(err){} );
					}
				} else {
					console.error('upload error: unrecognized file filed or zero size or empty name');
					fs.unlink( files[property].path, function(err){} );
				}
			}
		}

		speaker_data.biography = striptags(speaker_data.biography || '', allowedTags, '');

		if( speaker_data.link ) {
			database.editSpeaker( req.fingerprint, speaker_data, function( err, ok, edited_speaker ) {
				res.json({
					message_type: 'admin/speaker/edit/success',
					speaker: edited_speaker
				});

				broadcastSpeakersUpdate();
				broadcastScheduleUpdate();
			});
		} else {
			let new_speaker = database.addNewSpeaker( req.fingerprint, speaker_data, function( err, ok, new_speaker ) {
				res.json({
					message_type: 'admin/speaker/new/success',
					speaker: new_speaker
				});

				broadcastSpeakersUpdate();
			});
		}
	});
});

app.get('/', require('./routes/home'));
app.get('/schedule', require('./routes/schedule'));
app.get('/now', require('./routes/now'));
app.get('/questions', require('./routes/questions'));
app.get('/info', require('./routes/info'));
app.get('/speakers', require('./routes/speakers'));
app.get('/feedback', require('./routes/feedback'));

// moderator's page
app.get('/mod', require('./routes/mod'));

// administrator's pages
app.get('/admin', require('./routes/schedule-admin'));
app.get('/admin/schedule', require('./routes/schedule-admin'));
app.get('/admin/info', require('./routes/info-admin'));
app.get('/admin/speakers', require('./routes/speakers-admin'));
app.get('/admin/feedback', require('./routes/feedback-admin'));
app.get('/admin/settings', require('./routes/settings-admin'));

// secret pages
app.get('/i/want/to/be/mod', require('./routes/iwanna'));
app.get('/big/secret/page', require('./routes/big-secret-page'));

app.get('/ics', function(req, res) {
	let event_id = req.query.event_id;

	// fetch event from db
	let event = database.getEvent( req.fingerprint, event_id, function( err_event, ok_event, event ) {
        if (!ok_event || !event) {
            console.error('Error while fetching event with '+event_id+': ', err_event);
            res.end();
            return;
        }

        let m_start = moment.unix(event.date).add(event.start_time, 'seconds').utc();
        //let m_start = moment.tz(event.date, 'YYYY-MM-DD', 'UTC').add(event.start_time, 'seconds').utc();

        let event_data = {
            startInputType: 'utc',
            startOutputType: 'utc',
            start: m_start.format('YYYY-M-D-HH-mm').split("-").map((n) => parseInt(n, 10)),
            duration: { minutes: Math.round((event.end_time - event.start_time)/60) },
            title: event.title,
            //description: 'Доклад "'+event.title+'"\r\n\r\nДокладчик: '+event.speaker_name,
            //location: 'Folsom Field, University of Colorado (finish line)',
            //url: 'http://roxar.ru/',
            //geo: { lat: 40.0095, lon: 105.2669 },
            //categories: ['Конференция Roxar'],
            status: 'CONFIRMED',
            //organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
        };

        if(event.extra_session) {
            event_data.description = '"'+event.title+'"';
            if(event.location) {
                event_data.description += '\r\n\r\nМесто проведения: '+event.location;
                event_data.location = event.location;
            }
        } else {
            if(event.speaker_name) {
                event_data.description = 'Доклад "'+event.title+'"\r\n\r\nДокладчик: '+event.speaker_name;
            } else {
                event_data.description = event.title;
            }
        }

        ics.createEvent(event_data, (error, value) => {
            if (error) {
                console.log(error);
                return;
            }

            res.set({
                'Content-type': 'text/calendar; charset=utf-8'
            });
            res.send(value);
        });
    });
});

function getReport(req, res) {
    database.getSchedule(req.fingerprint, function(schedule_err, schedule_ok, days) {
        if(!schedule_ok){
            console.error(schedule_err);
            res.end();
            return;
        }

        ratings
        .aggregate([{
            $group: {
                _id: '$event_id',
                ratings: {
                    $push: '$rating',
                }
            }
        }])
        .toArray(function(ratings_err, r_ratings) {
            if(ratings_err) {
                console.error(ratings_err);
                res.end();
                return;
            }

            r_ratings = r_ratings.map(function(r) {
                let avg_rating = 0;

                if(r.ratings) {
                    for(let i = 0; i < r.ratings.length; i++) {
                        avg_rating += parseInt(r.ratings[i], 10);
                    }

                    avg_rating = Math.round((avg_rating / r.ratings.length)*100)/100;
                }

                return {
                    _id: ''+r._id,
                    rating: avg_rating,
                    raters: (r.ratings? r.ratings.length: 0),
                }
            });

            questions
            .aggregate([{
                $group: {
                    _id: '$event_id',
                    questions: {
                        $push: '$$ROOT',
                    }
                }
            }])
            .toArray(function(err_questions, questions) {
                if( err_questions ) {
                    console.error(err_questions);
                    res.end();
                    return;
                }

                for(var d = 0; d < days.length; d++) {
                    res.write(days[d].date_formatted+"\r\n");

                    for(var s = 0; s < days[d].sessions.length; s++) {
                        for(var e = 0; e < days[d].sessions[s].events.length; e++) {
                            let ev = days[d].sessions[s].events[e];
                            let isLast = (e >= (days[d].sessions[s].events.length-1));

                            let avg_rating = 0, raters = 0;
                            for(let r_id = 0; r_id < r_ratings.length; r_id++) {
                                if( r_ratings[r_id]._id == ''+ev._id ) {
                                    avg_rating = r_ratings[r_id].rating;
                                    raters = r_ratings[r_id].raters;
                                    break;
                                }
                            }

                            let _q = [];
                            let reg = /(\r|\n)/g;
                            for(let q_id = 0; q_id < questions.length; q_id++) {
                                if( questions[q_id]._id == ''+ev._id ) {
                                    
                                    _q = questions[q_id].questions.map(function(q) {
                                        q.text = q.text.replace(reg, ' ');
                                        q.voters_count = q.voters.length;
                                        return q;
                                    });

                                    _q = _q.sort(database.sortUserQuestions);

                                    break;
                                }
                            }
                            
                            // now:
                            // avg_rating: average rating for ev
                            // _q: all questions for ev

                            res.write(ev.start_time_formatted+';'+ev.title.trim()+';'+(ev.speaker_name||'').trim()+';'+avg_rating+';'+raters+"\r\n");

                            if( _q && _q.length ) {
                                res.write("Номер;Лайки;Содержание\r\n");
                                for(var q = 0; q < _q.length; q++) {
                                    res.write((q+1)+';'+(_q[q].voters_count)+';"'+(_q[q].text)+'"'+"\r\n");
                                }
                            } else {
                                res.write("Не было вопросов\r\n");
                            }

                            res.write("\r\n");
                        }
                    }
                }

                res.end();
            });
        });
    });
}

app.get('/report.csv', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/csv');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Content-disposition', 'attachment; filename=report.csv');

    getReport(req, res);

    /*
    database.getSchedule(req.fingerprint, function(schedule_err, schedule_ok, days) {
        if(!schedule_ok){
            console.error(schedule_err);
            return;
        }

        for(var d = 0; d < days.length; d++) {
            for(var s = 0; s < days[d].sessions.length; s++) {
                for(var e = 0; e < days[d].sessions[s].events.length; e++) {
                    let ev = days[d].sessions[s].events[e];
                    let isLast = (e >= (days[d].sessions[s].events.length-1));

                    ratings.find({
                        'event_id': ''+ev._id,
                    },{
                        'rating': 1,
                    })
                    .toArray(function(ratings_err, r_ratings) {
                        if(ratings_err) {
                            res.end();
                            return;
                        }

                        let avg_rating = 0;
                        if( r_ratings && r_ratings.length ) {
                            r_ratings.map(function(r) {
                                avg_rating += parseInt(r.rating, 10);
                            });

                            avg_rating = Math.round((avg_rating / r_ratings.length)*100)/100;
                        }

                        database.getUserQuestions(req.fingerprint, ''+ev._id, function( err_questions, ok_questions, questions ) {
                            //res.write(days[d].date_formatted+"\r\n");
                            res.write(ev.start_time_formatted+','+ev.title.trim()+','+avg_rating+"\r\n");

                            if( ok_questions ) {
                                if( questions && questions.length ) {
                                    res.write("Номер,Лайки,Содержание\r\n");
                                    for(var q = 0; q < questions.length; q++) {
                                        res.write((q+1)+','+(questions[q].voters_count)+',"'+(questions[q].text)+'"'+"\r\n");
                                    }
                                } else {
                                    res.write("Не было вопросов\r\n");
                                }
                            }

                            res.write("\r\n");

                            if( isLast ) {
                                res.end();
                            }
                        });
                    });
                }
            }
        }
    });
    */
});

var template404 = require('./routes/errors/404.marko');
app.get('*', function(req, res) {
    res.status(404).marko( template404, {});
});

var server = app.listen(port, function() {
	console.log('Server started on \nhttp://localhost:' + port + '/');

	database
	.connect()
	.then(() => {
		console.log("Ready for work.");

		if (process.send) {
			process.send('online');
		}
	})
	.catch(() => {});
});

var primus = new Primus(server, {
	transformer: 'websockets',
});

primus.save( __dirname + '/scripts/primus.js' );

primus.on('connection', function(spark) {
	spark.on('data', function(data) {
		// TODO: too dirty
		if(!database.online)
			return;

		if(!data.message_type)
			return;

		if( spark.query.fingerprint != data.fingerprint ) {
			console.log('unauthorized access: query fingerprint does not match the one in request', data);
			return;
		}

		console.log('message received: ', data);

		if(data.message_type == 'current_event') {
			let current_timestamp = Date.now();

			let db_timestamp = current_timestamp;
			if (app.locals.holding_event) {
				db_timestamp = app.locals.holding_event;
			}

			database.getCurrentEventData(
				data.fingerprint,
				db_timestamp,
				function( err, ok, eventData ) {
					if(eventData) {
						if (eventData.current_event) {
							eventData.message_type = 'current_event';
						
							if (app.locals.holding_event) {
								let eventDataTemplate = database.getCurrentEventDataTemplate(current_timestamp, eventData.settings.timezone);
						
								// we have to rewrite the data we got from db (since it's forged) and replace it with actual values
								Object.assign(eventData, eventDataTemplate);
						
								eventData.holding_current_event = true;
							}
						} else {
							eventData.message_type = 'no_current_event';
						}

						if (eventData.current_questions && eventData.current_questions.length) {
							eventData.current_questions = eventData.current_questions
								.filter((q) => q.user_id == data.fingerprint || q.status != 'new')
								.map((q) => {q.owned = q.user_id == data.fingerprint; return q;});
						}

						spark.write(eventData);
					} else {
						spark.write({
							message_type: 'no_current_event',
							current_event: null,
							next_event: null,
						});
					}
				}
			);
		} else
		if(data.message_type == 'mod_event') {
			// check if query is coming from moderator(s)
			if( !database.isMod(spark.query.fingerprint) )
				return;

			let current_timestamp = Date.now();

			let db_timestamp = current_timestamp;
			if (app.locals.holding_event) {
				db_timestamp = app.locals.holding_event;
			}

			let eventData = database.getCurrentModEventData(
				data.fingerprint,
				db_timestamp,
				function( err, ok, eventData ) {
					if(eventData) {
						if (eventData.current_event) {
							eventData.message_type = 'mod_event';
						
							if (app.locals.holding_event) {
								let eventDataTemplate = database.getCurrentEventDataTemplate(current_timestamp, eventData.settings.timezone);
						
								// we have to rewrite the data we got from db (since it's forged) and replace it with actual values
								Object.assign(eventData, eventDataTemplate);
						
								eventData.holding_current_event = true;
							}
						} else {
							eventData.message_type = 'no_current_event';
						}

						spark.write(eventData);
					} else {
						spark.write({
							message_type: 'no_current_event',
							mod_event: null,
							next_event: null,
						});
					}
				}
			);
		} else
		if(data.message_type == 'give/feedback') {
			// post votes to db
			database.postFeedback(
				data.fingerprint,
				data.block_id,
				data.answers,
				function( err, ok ) {
					console.log('');
					if( ok ) {
						spark.write({
							message_type: 'give/feedback/success',
							block_id: data.block_id,
							text: 'got feedback for block #'+data.block_id+': '+data.answer_id
						});
					}
				}
			);
		} else
		if(data.message_type == 'give/rating') {
			// update rating in database
			database.updateEventRating(
				data.fingerprint,
				data.event_id,
				data.rating,
				function( err, ok ) {
					if( ok ) {
						updated_rating = data.rating;

						spark.write({
							message_type: 'give/rating/success',
							rating: updated_rating,
						});
					} else {
						spark.write({
							message_type: 'give/rating/error',
						});
                    }
				}
			);
		} else
		if(data.message_type == 'question/new') {
            let trimmed_question = data.question_text.trim();

            if(trimmed_question.length > 0) {
                // add question to the database
                database.addNewQuestion(
                    data.fingerprint,
                    data.event_id,
                    data.question_text,
                    function( err, ok, new_question ) {
                        spark.write({
                            message_type: 'question/new/success',
                            text: 'got question for event #'+data.event_id+': '+data.question_text
                        });

                        // send back the updated questions
                        spark.write({
                            message_type: 'question/new',
                            question: {
                                _id: new_question._id,
                                event_id: new_question.event_id,
                                //question_id: new_question.question_id,
                                added_time: new_question.added_time,
                                voters_count: new_question.voters.length,
                                text: new_question.text,
                                status: 'new',
                                voted: true,
                                owned: true,
                            }
                        });

                        // broadcast newly arrived question to moderator(s)
                        primus.forEach(function(broadcast_spark) {
							if( broadcast_spark.query.page != 'mod' || !database.isMod(broadcast_spark.query.fingerprint))
								return;

                            broadcast_spark.write({
                                message_type: 'mod/question/new',
                                question: new_question
                            });
                        });
                    }
                );
            } else {
                spark.write({
                    message_type: 'add/question/error',
                    text: 'Ошибка при добавлении вопроса: пустой вопрос.'
                });
            }
		} else
		if(data.message_type == 'event/unhold') {
			// check if query is coming from moderator(s)
			if( !database.isMod(spark.query.fingerprint) )
				return;

			database.fixCurrentEventEnd( null, null, app.locals.holding_event, Date.now(), function() {
				broadcastCurrentEventUpdate(false, (somethingChanged) => {
					if (somethingChanged)
						broadcastScheduleUpdate();
				});
			});
		} else
		if(data.message_type == 'event/hold') {
			// check if query is coming from moderator(s)
			if( !database.isMod(spark.query.fingerprint) )
				return;

			broadcastCurrentEventUpdate(true);
		} else
		if(data.message_type == 'question/edit/status') {
			// check if query is coming from moderator(s)
			if( !database.isMod(spark.query.fingerprint) )
				return;

			const to_status = data.status;

			// here we should mark the question as accepted in the db
			database.setQuestionStatus(
				data.fingerprint,
				data.question_id,
				data.status,
				function( err, ok, edited_question ) {
					if(!ok) {
						spark.write({
							message_type: 'question/edit/status/error',
							text: 'question status change failed for question #'+data.question_id
						});
						return;
					}

					const from_status = edited_question.status;

					spark.write({
						message_type: 'question/edit/status/success',
						text: `question #${data.question_id} changed from ${from_status} status to ${to_status}`,
					});

					let filtered_question = {
						_id: edited_question._id,
						event_id: edited_question.event_id,
						//question_id: edited_question._id,
						added_time: edited_question.added_time,
						voters_count: edited_question.voters.length,
						text: edited_question.text,
						status: to_status,
					};

					let from_private = from_status == 'new' || from_status == 'rejected';
					let to_private = to_status == 'new' || to_status == 'rejected';
					let now_page = false;
					let mod_page = false;

					// broadcast newly accepted question to the users
					primus.forEach(function(broadcast_spark) {
						filtered_question.voted = (edited_question.voters.indexOf(broadcast_spark.query.fingerprint) >= 0);
						filtered_question.owned = (edited_question.user_id == broadcast_spark.query.fingerprint);
						now_page = broadcast_spark.query.page == 'now';
						mod_page = broadcast_spark.query.page == 'mod';

						// public -> public: send updates to everyone
						// mods get everything as status updates:
						if (
							(now_page && !from_private && !to_private) || 
							(mod_page && database.isMod(broadcast_spark.query.fingerprint))
						) {
							broadcast_spark.write({
								message_type: 'question/edit/status',
								question_id: filtered_question._id,
								status: to_status
							});
						} else
						// private -> public: edit status for mods (see above) and new question for everyone else
						if (now_page && from_private && !to_private)
							broadcast_spark.write({
								message_type: 'question/new',
								question: filtered_question,
							});
						else
						// public -> private: delete question for everyone
						// private -> private: delete question for everyone
						// only owners should have these questions, so we send the messages only to them:
						if ( now_page && to_private && filtered_question.owned ) {
							broadcast_spark.write({
								message_type: 'question/delete',
								question_id: filtered_question._id,
								status: to_status
							});
						}
					});
				}
			);
		} else
		/* if(data.message_type == 'reject/question') {
			// check if query is coming from moderator(s)
			if( !database.isMod(spark.query.fingerprint) )
				return;

			// here we should mark the question as rejected in the db
			database.removeQuestion(
				data.fingerprint,
				data.question_id,
				function( err, ok, removed_question ) {
					if(!ok) {
						spark.write({
							message_type: 'reject/question/error',
							text: 'question rejection failed for question #'+data.question_id
						});
						return;
					}

					spark.write({
						message_type: 'reject/question/success',
						text: 'question rejected/deleted succeeded for question #'+data.question_id
					});

					// notify user, whose question was rejected and moderator(s)
					primus.forEach(function(broadcast_spark) {
						if( !database.isMod(broadcast_spark.query.fingerprint) && ( broadcast_spark.query.fingerprint != removed_question.user_id ) )
							return;

						broadcast_spark.write({
							message_type: 'reject/question',
							question_id: removed_question._id
						});
					});
				}
			)
		} else */
		if(data.message_type == 'question/edit') {
			// check if query is coming from moderator(s)
			if( !database.isMod(spark.query.fingerprint) )
				return;

			// here we write the changes to the db
			database.editQuestion(
				data.fingerprint,
				data.question_id,
				data.question_text,
				'accepted',
				function( err, ok, edited_question ) {
					if(!ok) {
						spark.write({
							message_type: 'question/edit/error',
							text: 'question edit failed for question #'+data.question_id
						});

						return;
					}

					spark.write({
						message_type: 'question/edit/success',
						text: 'question edit succeeded for question #'+data.question_id
					});

					filtered_question = {
						_id: edited_question._id,
						event_id: edited_question.event_id,
						added_time: edited_question.added_time,
						voters_count: edited_question.voters.length,
						text: edited_question.text,
						status: edited_question.status,
					};

					// broadcast newly (edited and) accepted question to the users
					primus.forEach(function(broadcast_spark) {
						filtered_question.voted = (edited_question.voters.indexOf(broadcast_spark.query.fingerprint) >= 0);
						filtered_question.owned = (edited_question.user_id == broadcast_spark.query.fingerprint);

						if (broadcast_spark.query.page == 'now')
							broadcast_spark.write({
								message_type: 'question/edit',
								question: filtered_question,
							});

						// additional notification for moderator(s)
						if( broadcast_spark.query.page == 'mod' && database.isMod(broadcast_spark.query.fingerprint) ) {
							broadcast_spark.write({
								message_type: 'mod/question/edit',
								question: filtered_question,
							});
						}
					});
				}
			);
		} else
		if(data.message_type == 'question/vote/add') {
			database.questionVoteAdd(
				spark.query.fingerprint,
				data.question_id,
				function( err, ok, new_votecount ) {
					if(!ok)
						return;

					primus.forEach(function(broadcast_spark) {
						broadcast_spark.write({
							message_type: 'question/vote/success',
							question_id: data.question_id,
							voted: ( broadcast_spark.query.fingerprint == spark.query.fingerprint ),
							voters_count: new_votecount
						});
					});
				}
			);
		} else
		if(data.message_type == 'question/vote/remove') {
			database.questionVoteRemove(
				spark.query.fingerprint,
				data.question_id,
				function( err, ok, new_votecount ) {
					if(!ok)
						return;

					primus.forEach(function(broadcast_spark) {
						broadcast_spark.write({
							message_type: 'question/vote/success',
							question_id: data.question_id,
							voted: ( broadcast_spark.query.fingerprint != spark.query.fingerprint ),
							voters_count: new_votecount
						});
					});
				}
			);
		} else
		if(data.message_type == 'admin/session/new') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.addNewSession(
				data.fingerprint,
				data.session,
				function( err, ok, new_session ) {
					if(!ok) {
						//console.error(err, ok, new_session);
						spark.write({
							message_type: 'admin/session/new/error',
							session: data.session
						});
						return;
					}

					spark.write({
						message_type: 'admin/session/new/success',
						session: new_session
					});

					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/session/edit') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.editSession(
				data.fingerprint,
				data.session,
				function( err, ok, new_session ) {
					if(!ok) {
						spark.write({
							message_type: 'admin/session/edit/error',
							session: data.session
						});
						return;
					}

					spark.write({
						message_type: 'admin/session/edit/success',
						session: new_session
					});

					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/session/delete') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.deleteSession(
				data.fingerprint,
				data.session_id,
				function( err, ok, deleted_session ) {
					if(!ok)
						return;

					spark.write({
						message_type: 'admin/session/delete',
						session_id: data.session_id,
					});

					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/event/new') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.addNewEvent(
				data.fingerprint,
				data.session_id,
				data.event,
				function( err, ok, new_event ) {
					if(!ok) {
						spark.write({
							message_type: 'admin/event/new/error',
							session_id: data.session_id
						});

						return;
					}

					spark.write({
						message_type: 'admin/event/new/success',
						session_id: data.session_id,
						event: new_event
					});

					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/event/edit') {
			if( !database.isAdmin(data.fingerprint) && !database.isMod(data.fingerprint) )
				return;

			database.editEvent(
				data.fingerprint,
				data.session_id,
				data.event,
				function( err, ok, new_event ) {
					if(!ok) {
						spark.write({
							message_type: 'admin/event/edit/error',
							session_id: data.session_id
						});

						return;
					}
						

					spark.write({
						message_type: 'admin/event/edit/success',
						session_id: data.session_id,
						event: new_event
					});

					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/event/delete') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.deleteEvent(
				data.fingerprint,
				data.event_id,
				function( err, ok, deleted_event ) {
					if(!ok)
						return;

					spark.write({
						message_type: 'admin/event/delete',
						event_id: data.event_id
					});

					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/info/flight/new') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			let new_flight = 
			database.addNewFlight(
				data.fingerprint,
				data.flight,
				function( err, ok, new_flight ) {
					if(!ok)
						return;

					// spark.write({
						// message_type: 'admin/info/flight/new',
						// flight: new_flight,
					// });

					broadcastFlightsUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/info/flight/edit') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			let edited_flight = 
			database.editFlight(
				data.fingerprint,
				data.flight,
				function( err, ok, edited_flight ) {
					if(!ok)
						return;

					// spark.write({
						// message_type: 'admin/info/flight/edit',
						// flight: edited_flight,
					// });

					broadcastFlightsUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/info/flight/delete') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.deleteFlight(
				data.fingerprint,
				data.flight_id,
				function( err, ok, deleted_flight ) {
					if(!ok)
						return;

					// spark.write({
						// message_type: 'admin/info/flight/delete',
						// flight: deleted_flight,
					// });

					broadcastFlightsUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/info/contact/new') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.addNewContact(
				data.fingerprint,
				data.contact,
				function( err, ok, new_contact ) {
					if(!ok) {
						console.error(err);
						return;
					}

					// spark.write({
						// message_type: 'admin/info/contact/new',
						// contact: new_contact,
					// });

					broadcastContactsUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/info/contact/edit') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.editContact(
				data.fingerprint,
				data.contact,
				function( err, ok, edited_contact ) {
					if(!ok) {
						console.error(err);
						return;
					}

					spark.write({
						message_type: 'admin/info/contact/edit',
						contact: edited_contact,
					});

					broadcastContactsUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/info/contact/delete') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.deleteContact(
				data.fingerprint,
				data.contact_id,
				function( err, ok, deleted_contact ) {
					if(!ok) {
						console.error(err);
						return;
					}

					// spark.write({
						// message_type: 'admin/info/contact/delete',
						// contact: deleted_contact,
					// });

					broadcastContactsUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/speaker/new') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.addNewSpeaker(
				data.fingerprint,
				data.speaker,
				function( err, ok, new_speaker ) {
					if(!ok)
						return;

					spark.write({
						message_type: 'admin/speaker/new',
						speaker: new_speaker,
					});

					broadcastSpeakersUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/speaker/edit') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.editSpeaker(
				data.fingerprint,
				data.speaker,
				function( err, ok, thing ) {
					if(!ok)
						return;

					// spark.write({
						// message_type: 'admin/speaker/edit',
						// speaker: edited_speaker,
					// });

					broadcastSpeakersUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/speaker/toggle') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.toggleSpeaker(
				data.fingerprint,
				data.speaker_link,
                data.speaker_hidden,
				function( err, ok, thing ) {
					if(!ok)
						return;

					// spark.write({
						// message_type: 'admin/speaker/edit',
						// speaker: edited_speaker,
					// });

					broadcastSpeakersUpdate();
                    broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/speaker/delete') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			database.deleteSpeaker(
				data.fingerprint,
				data.speaker_link,
				function( err, ok, deleted_speaker ) {
					if(!ok) {
						console.error(err, deleted_speaker);
						return;
					}

					// spark.write({
						// message_type: 'admin/speaker/delete',
						// speaker_link: deleted_speaker.link,
					// });

					broadcastSpeakersUpdate();
					broadcastScheduleUpdate();
				}
			);
		} else
		if(data.message_type == 'admin/settings/edit') {
			if( !database.isAdmin(data.fingerprint) )
				return;

			data.site_settings.home_header = striptags(data.site_settings.home_header || '', allowedTags).trim();
			data.site_settings.home_description = striptags(data.site_settings.home_description || '', allowedTags).trim();
			data.site_settings.footer_text = striptags(data.site_settings.footer_text || '', allowedTags).trim();

			database.setSettings(
				data.fingerprint,
				data.site_settings,
				function( err, ok, update_settings ) {
					if(!ok)
						return;

					spark.write({
						message_type: 'admin/settings/edit',
						site_settings: update_settings
					});

					//broadcastSettingsUpdate();
				}
			);
		}
		else {
			spark.write('unknown message');
		}
	});

	//console.log('established a new connection with the following params: ', spark.query);

	spark.write({
		message_type: 'handshake',
		text: 'hello!'
	});
});

/* primus.on('initialised', function() {
	var m;
	setInterval(function() {
		m = moment();

		// get current_event

		primus.write({
			message_type: 'progress',
			current_date: m.format("D MMMM, dddd"),
			current_time: m.format("HH:mm")
		});
	}, 10000);
}); */

const currentEventBroadcastingJob = new CronJob('*/10 * * * * *', broadcastCurrentEventUpdate, null, false, 'Europe/Moscow');
currentEventBroadcastingJob.start();