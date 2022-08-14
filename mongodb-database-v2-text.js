var moment = require('moment-timezone');
var translit = require('cyrillic-to-translit-js');
var path = require('path');
var fs = require('fs');
var uploadDir = path.join(__dirname, '/public/photos');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {ObjectId} = require('mongodb'); // or ObjectID 

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
//const dbName = 'presentation';
//const dbName = 'tyumen2018';
const dbName = 'ruc2019';

var event_types = [
    {
        _id: -2,
        name: 'Фоновое',
        rowClasses: '',
        cellClasses: 'font-weight-bold',
    },
    {
        _id: -1,
        name: 'Неважное',
        rowClasses: 'text-gray-dark',
        cellClasses: '',
    },
    {
        _id: 0,
        name: 'Обычное',
        rowClasses: '',
        cellClasses: '',
    },
    {
        _id: 1,
        name: 'Важное',
        rowClasses: '',
        cellClasses: 'font-weight-bold',
    }
];

var default_settings = {
    'header': 'RUC',
    'home_header': 'Добро пожаловать на конференцию пользователей ПО ROXAR.',
    'home_description': 'Цифровизация в разведке и добыче: интеграция аппаратных решений, программного обеспечения и технологий для управления месторождением.',
    'footer_enable': true,
    'footer_text': 'Конференция пользователей ПО ROXAR.',
    'timezone': 'Europe/Moscow',
};

var admins = [
	'6f87da67b42344bf8302086279242f5dab36fdb7',
	'603222c16d5bc63dd1a373ed992949c26d02505b',
	'691b517e6d010a1fb88d15478b82616d6760b260'
];

var moderators = [
	'6f87da67b42344bf8302086279242f5dab36fdb7',
	'603222c16d5bc63dd1a373ed992949c26d02505b',
	'691b517e6d010a1fb88d15478b82616d6760b260'
];

/*module.exports.data = {
days: [
	{
		day_id: 0,
		date: 1541624400,
		main_sessions: 3,
		extra_sessions: 1,
		sessions: [
			{
				session_id: 0,
				num: 0,
				title: null,
				first_event: 1541649600,
				show_title: false,
				extra_session: false,
				events: [
					{
						event_id: 0,
						start_time: 1541649600,
						end_time: 1541660400,
						title: 'Завтрак',
						questions_allowed: false,
						ratings_allowed: false,
					},
				]
			},
			{
				session_id: 1,
				num: 1,
				title: 'Пленарное заседание (Зал А)',
				first_event: 1541660400,
				show_title: true,
				extra_session: false,
				events: [
					{
						event_id: 1,
						start_time: 1541660400,
						end_time: 1541661000,
						title: 'Вступительное слово',
						speaker_name: 'Алексей Эткин',
						speaker_link: 'aleksey-etkin',
						questions_allowed: true,
						ratings_allowed: true,
					},
					{
						event_id: 2,
						start_time: 1541661000,
						end_time: 1541662200,
						title: 'Программное обеспечение Roxar - решения для управления месторождением',
						speaker_name: 'Ирина Колбикова',
						speaker_link: 'irina-kolbikova',
						questions_allowed: true,
						ratings_allowed: true,
					},
				]
			},
			{
				session_id: 2,
				num: 2,
				title: 'Сессия 1. Геологическое моделирование и интерпретация (Зал А)',
				first_event: 1541662200,
				show_title: true,
				extra_session: false,
				events: [
					{
						event_id: 3,
						start_time: 1541662200,
						end_time: 1541663400,
						title: 'Интерпретация сейсмических данных',
						speaker_name: 'Василий Келлер',
						speaker_link: 'vasiliy-keller',
						questions_allowed: true,
						ratings_allowed: true,
					},
					{
						event_id: 4,
						start_time: 1541663400,
						end_time: 1541664000,
						title: 'Кофе-пауза',
						questions_allowed: false,
						ratings_allowed: false,
					},
					{
						event_id: 5,
						start_time: 1541664000,
						end_time: 1541666400,
						title: 'Новые разработки в области работы со скважинными данными, межскважинной корреляцией',
						speaker_name: 'Кнут Митвейт',
						speaker_link: 'knut-mitveit',
						questions_allowed: true,
						ratings_allowed: true,
					}
				]
			},
			{
				session_id: 4,
				num: 3,
				show_title: false,
				extra_session: true,
				events: [
					{
						event_id: 7,
						start_time: 1544241600,
						end_time: 1544252400,
						title: 'Минифутбол',
						location: 'Стадион А',
					},
				]
			}
		],
	},
	{
		day_id: 1,
		date: 1541710800,
		main_sessions: 1,
		extra_sessions: 0,
		sessions: [
			{
				session_id: 3,
				num: 0,
				title: null,
				first_event: 1541736000,
				show_title: false,
				extra_session: false,
				events: [
					{
						event_id: 6,
						start_time: 1541736000,
						end_time: 1541746800,
						title: 'Завтрак',
						questions_allowed: false,
						ratings_allowed: false,
					},
				]
			},
		],
	},
],
questions: [
	{
		event_id: 3,
		question_id: 0,
		user_id: '2d24204a43cc7249b2bcfdf6b81b6f724439f281',
		added_time: 1,
		voters: ['2d24204a43cc7249b2bcfdf6b81b6f724439f281'],
		text: 'Вопрос 1',
		accepted: true,
	}
],
ratings: [
	{
		event_id: 0,
		user_id: '2d24204a43cc7249b2bcfdf6b81b6f724439f281',
		rating: 1,
	}
],
feedback: [
	{
		block_id: 0,
		num: 1,
		title: 'Содержательная часть конференции',
		questions: [
			{
				question_id: 0,
				num: 1,
				content: 'Было ли для Вас интересным и полезным посещение конференции?',
				type: 'variants',
				variants: [
					'Да, очень',
					'Вполне',
					'Ожидал(а) большего'
				]
			},
			{
				question_id: 1,
				num: 2,
				content: 'Хотели бы Вы принять участие в следующей конференции?',
				type: 'variants',
				variants: [
					'Да',
					'Возможно',
					'Скорее нет'
				]
			},
			{
				question_id: 2,
				num: 3,
				content: 'Какие темы докладов и презентаций были бы интересны в дальнейшем?',
				type: 'text',
				text: '',
			},
		],
		answers: [
			{
				user_id: '2d24204a43cc7249b2bcfdf6b81b6f724439f281',
				values: [
					'0',
					'1',
					'Привет!'
				]
			}
		]
	},
	{
		block_id: 1,
		num: 2,
		title: 'Организация конференции',
		comment: '(пожалуйста оцените по пятибалльной шкале, где 5 – высший балл)',
		questions: [
			{
				question_id: 0,
				num: 1,
				content: 'Общий уровень организации мероприятия',
				type: 'variants',
				variants: [
					'1',
					'2',
					'3',
					'4',
					'5'
				]
			},
			{
				question_id: 1,
				num: 2,
				content: 'Место и время проведения конференции',
				type: 'variants',
				variants: [
					'1',
					'2',
					'3',
					'4',
					'5'
				]
			},
			{
				question_id: 2,
				num: 3,
				content: 'Своевременность предоставления информации',
				type: 'variants',
				variants: [
					'1',
					'2',
					'3',
					'4',
					'5'
				]
			},
		],
		answers: []
	},
	{
		block_id: 2,
		num: 3,
		title: 'Предложения и комментарии',
		comment: '(пожалуйста поделитесь с нами своими пожеланиями)',
		questions: [
			{
				question_id: 0,
				num: 1,
				type: 'text',
				text: '',
				placeholder: 'Текст Вашего комментария / предложения'
			},
		],
		answers: [
			{
				user_id: '2d24204a43cc7249b2bcfdf6b81b6f724439f281',
				values: [
					'Всё было замечательно!'
				]
			}
		]
	},
],
speakers: [
	{
		link: 'ivan-ustinov', // unique key
		name: 'Иван Устинов',
		department: 'Департамент технической поддержки',
		position: 'Старший геолог',
		photo: null,
		biography: 'Один из ведущих специалистов в области геологии и геомеханики. С января 2011 года осуществлял обучения, консультации и техническую поддержку пользователей в Компании Роксар. С середины 2012 года занимался геологическим, геомеханическим моделированием и задачами сопровождения бурения в компании Lukoil overseas на проекте Западная Курна-2. С 2016 года занимается развитием геомеханического моделирования в компании Roxar. Принимал участие в российских и зарубежных проектах, расположенных как на суше, так и в море.<br/><br/><strong>ОБРАЗОВАНИЕ:</strong><br/>РГУ нефти и газа им. И. М. Губкина, специализация «Промысловая геология».',
	}
],
flights: [
	{
		flight_id: 0,
		flight_number: 'XXYYY1',
		date: 1544389200,
		checkout_time: 1544425200,
		transfer_time: 1544428800,
		flight_time: 1544432400,
	},
	{
		flight_id: 1,
		flight_number: 'XXYYY2',
		date: 1544389200,
		checkout_time: 1544443200,
		transfer_time: 1544446800,
		flight_time: 1544450400,
	}
],
contacts: [
	{
		contact_id: 0,
		order_num: 1,
		name: 'Иванов Иван Иванович',
		phone_number: '+71111111111',
	},
	{
		contact_id: 1,
		order_num: 2,
		name: 'Петров Пётр Петрович',
		phone_number: '+72222222222',
	},
],
last_d_id: 3,
last_s_id: 4,
last_e_id: 8,
last_q_id: 1,
last_f_id: 2,
last_c_id: 2,
};*/

/* module.exports.data = {
	days: [],
	questions: [],
	ratings: [],
	feedback: [
		{
			block_id: 0,
			num: 1,
			title: 'Содержательная часть конференции',
			questions: [
				{
					question_id: 0,
					num: 1,
					content: 'Было ли для Вас интересным и полезным посещение конференции?',
					type: 'variants',
					variants: [
						'Да, очень',
						'Вполне',
						'Ожидал(а) большего'
					]
				},
				{
					question_id: 1,
					num: 2,
					content: 'Хотели бы Вы принять участие в следующей конференции?',
					type: 'variants',
					variants: [
						'Да',
						'Возможно',
						'Скорее нет'
					]
				},
				{
					question_id: 2,
					num: 3,
					content: 'Какие темы докладов и презентаций были бы интересны в дальнейшем?',
					type: 'text',
					text: '',
				},
			],
			answers: []
		},
		{
			block_id: 1,
			num: 2,
			title: 'Организация конференции',
			comment: '(пожалуйста оцените по пятибалльной шкале, где 5 – высший балл)',
			questions: [
				{
					question_id: 0,
					num: 1,
					content: 'Общий уровень организации мероприятия',
					type: 'variants',
					variants: [
						'1',
						'2',
						'3',
						'4',
						'5'
					]
				},
				{
					question_id: 1,
					num: 2,
					content: 'Место и время проведения конференции',
					type: 'variants',
					variants: [
						'1',
						'2',
						'3',
						'4',
						'5'
					]
				},
				{
					question_id: 2,
					num: 3,
					content: 'Своевременность предоставления информации',
					type: 'variants',
					variants: [
						'1',
						'2',
						'3',
						'4',
						'5'
					]
				},
			],
			answers: []
		},
		{
			block_id: 2,
			num: 3,
			title: 'Предложения и комментарии',
			comment: '(пожалуйста поделитесь с нами своими пожеланиями)',
			questions: [
				{
					question_id: 0,
					num: 1,
					type: 'text',
					text: '',
					placeholder: 'Текст Вашего комментария / предложения'
				},
			],
			answers: []
		},
	],
	speakers: [],
	flights: [],
	contacts: [],
	last_d_id: 0,
	last_s_id: 0,
	last_e_id: 0,
	last_q_id: 0,
	last_f_id: 0,
	last_c_id: 0,
}; */

module.exports.getEventTypes = function() {
    return event_types;
}

module.exports.online = false;

module.exports.connect = function() {
	return MongoClient
	.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
	.then((client) => {
		console.log("Connected successfully to MongoDB.");

		this.db = client.db(dbName);

		return this.db.listCollections().forEach((r) => {
			/*if(r) {
				console.log('dropping collection '+r.name);
				this.db.dropCollection(r.name);
			}*/
			/*if(r.name == 'questions') {
				console.log('dropping collection '+r.name);
				this.db.dropCollection(r.name);
			}*/
			/*if(r.name == 'feedback') {
				console.log('dropping collection '+r.name);
				this.db.dropCollection(r.name);
			}*/
		}).then(() => {
			sessions = this.db.collection('sessions');
			questions = this.db.collection('questions');
			ratings = this.db.collection('ratings');
			feedback = this.db.collection('feedback');
			speakers = this.db.collection('speakers');
			flights = this.db.collection('flights');
			contacts = this.db.collection('contacts');
			settings = this.db.collection('settings');
			//users = this.db.collection('users');

			this.online = true;
		});
	});
}

module.exports.reinstall = function(cb) {
    return this.db.listCollections().forEach((r) => {
        if(r) {
            console.log('dropping collection '+r.name);
            this.db.dropCollection(r.name);
        }
    }).then(() => {
        this.reinstateFeedback(cb);
    });
};

module.exports.reinstateFeedback = function(cb) {
    var clean_fb = [{
        num: 1,
        title: 'Содержательная часть конференции',
        questions: [
            {
                question_id: 0,
                num: 1,
                content: 'Было ли для Вас интересным и полезным посещение конференции?',
                type: 'variants',
                variants: [
                    'Да, очень',
                    'Вполне',
                    'Ожидал(а) большего'
                ]
            },
            {
                question_id: 1,
                num: 2,
                content: 'Хотели бы Вы принять участие в следующей конференции?',
                type: 'variants',
                variants: [
                    'Да',
                    'Возможно',
                    'Скорее нет'
                ]
            },
            {
                question_id: 2,
                num: 3,
                content: 'Какие темы докладов и презентаций были бы интересны в дальнейшем?',
                type: 'text',
                text: '',
            },
        ],
        answers: []
    },
    {
        num: 2,
        title: 'Организация конференции',
        comment: '(пожалуйста оцените по пятибалльной шкале, где 5 – высший балл)',
        questions: [
            {
                question_id: 0,
                num: 1,
                content: 'Общий уровень организации мероприятия',
                type: 'variants',
                variants: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5'
                ]
            },
            {
                question_id: 1,
                num: 2,
                content: 'Место и время проведения конференции',
                type: 'variants',
                variants: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5'
                ]
            },
            {
                question_id: 2,
                num: 3,
                content: 'Своевременность предоставления информации',
                type: 'variants',
                variants: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5'
                ]
            },
        ],
        answers: []
    },
    {
        num: 3,
        title: 'Предложения и комментарии',
        comment: '(пожалуйста поделитесь с нами своими пожеланиями; вы можете в любой момент вернуться сюда и дописать нужную информацию)',
        questions: [
            {
                question_id: 0,
                num: 1,
                type: 'text',
                text: '',
                placeholder: 'Текст Вашего комментария / предложения'
            },
        ],
        answers: []
    }];

    feedback.insertMany(clean_fb, {}, function(err, r) {
        if( typeof cb == "function" ) {
            if( err )
                cb( err, false );
            else
                cb( err, (r.insertedCount > 0), r.ops[0] );
        }
    });
}

module.exports.dropCollection = function( collection_name ) {
	return this.db.dropCollection( collection_name );
}

module.exports.dropFeedbackAnswers = function() {
    console.log('dropping feedback answers');

	return feedback.updateMany({
		// no filters
	},{
		$set: {
			'answers': []
		}
	});
}

module.exports.grantRights = function( fingerprint, role ) {
	if( role == 'admin' ) {
		if( admins.indexOf(fingerprint) < 0 )
			admins.push(fingerprint);
	}

	if( role == 'mod' ) {
		if( moderators.indexOf(fingerprint) < 0 )
			moderators.push(fingerprint);
	}
}

module.exports.revokeRights = function( fingerprint, role ) {
	if( role == 'admin' ) {
		let index = admins.indexOf(fingerprint);
		if( index >= 0 )
			admins.splice(index, 1);
	}

	if( role == 'mod' ) {
		let index = moderators.indexOf(fingerprint);
		if( index >= 0 )
			moderators.splice(index, 1);
	}
}

module.exports.isAdmin = function( fingerprint ) {
	return ( admins.indexOf(fingerprint) >= 0 );
}

module.exports.isMod = function( fingerprint ) {
	return ( moderators.indexOf(fingerprint) >= 0 );
}

// ---- settings ops ----- //
module.exports.getSettings = function(cb) {
	if( typeof cb !== "function" )
		return cb( null, false );;

	settings
	.findOne({
        _id: 'site_settings'
    }, {}, function(err, r) {
		if( err )
			cb( err, false );
		else {
            let defaults = Object.assign({}, default_settings);
            r  = Object.assign(defaults, r);

            cb( err, true, r );
        }
	});
}

module.exports.getSettingsAsync = function() {
    return new Promise((resolve, reject) => {
        this.getSettings(function(settings_err, settings_ok, settings) {
            if (settings_err || !settings_ok)
                return reject(settings_err);

            resolve(settings);
        });
    });
}

module.exports.setSettings = function( fingerprint, new_settings, cb) {
    settings.findOneAndUpdate({
        _id: 'site_settings'
    }, {
        $set: new_settings
    }, {
        upsert: true,
        returnOriginal: false,
    }, function(update_err, update_r) {
        if( typeof cb == "function" ) {
            if( update_err ) {
                console.error( update_err );
                cb( update_err, false );
            }
            else {
                //console.log( 'updated value:' );
                //console.log( update_r );
                cb( update_err, update_r.ok, update_r.value );
            }
        }
    });
}

// ---- session admin ops ---- //
module.exports.compareSessions = function( sa, sb ) {
	let a_first_event = (sa.first_event === undefined)? Infinity: sa.first_event;
	let b_first_event = (sb.first_event === undefined)? Infinity: sb.first_event;

	// first order by first_event
	if (a_first_event < b_first_event) return -1;
	if (a_first_event > b_first_event) return 1;

	// then order by ids
	if (sa.session_id < sb.session_id) return -1;
	if (sa.session_id > sb.session_id) return 1;

	return 0;
}

module.exports.addNewSession = function( fingerprint, session, cb ) {
    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let new_s = {
            _id: ObjectId(),
            num: session.num,
            title: session.title,
            date: moment.tz(session.date_input_formatted, 'YYYY-MM-DD', 'UTC').format('YYYY-MM-DD'),
            show_title: session.show_title,
            extra_session: session.extra_session,
            events: [],
        };

        sessions.insertOne(new_s, {}, function(err, r) {
            if( typeof cb == "function" ) {
                if( err )
                    cb( err, false );
                else
                    cb( err, (r.insertedCount > 0), r.ops[0] );
            }
        });
    });
}

module.exports.editSession = function( fingerprint, session, cb ) {
    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        sessions.findOneAndUpdate({
            _id: ObjectId(session._id)
        }, {
            $set: {
                'num': session.num,
                'title': session.title,
                'date': moment.tz(session.date_input_formatted, 'YYYY-MM-DD', site_settings.timezone).utc().format('YYYY-MM-DD'),
                'show_title': session.show_title,
                'extra_session': session.extra_session
            }
        }, {
            returnOriginal: false,
        }, function(err, r) {
            if( typeof cb == "function" ) {
                if( err ) {
                    cb( err, false );
                }
                else {
                    cb( err, r.ok, r.value );
                }
            }
        });
    });
}

module.exports.deleteSession = function( fingerprint, session_id, cb ) {
	sessions.findOneAndDelete({
		_id: ObjectId(session_id)
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value );
		}
	});
}

// ---- event admin ops ---- //

module.exports.compareEvents = function( ea, eb ) {
	// first order by start_time (earlier events on top)
	if (ea.start_time < eb.start_time) return -1;
	if (ea.start_time > eb.start_time) return 1;

	// order by event_id (smaller ids on top)
	return (ea.event_id - eb.event_id);
}

module.exports.addNewEvent = function( fingerprint, session_id, ev, cb ) {
    this.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let site_timezone = site_settings.timezone;

        sessions.findOne({
            _id: ObjectId(session_id)
        }, {}, function(find_err, find_r) {
            if( find_err || !find_r ) {
                //console.log(find_r);
                console.error(find_err);
                return;
            }

            let m_start_time = moment.tz(ev.start_time_formatted, 'HH:mm', site_timezone);
            let m_start_date = m_start_time.clone().startOf('day');
            ev.start_time = m_start_time.diff(m_start_date, 'seconds');

            let m_end_time = moment.tz(ev.end_time_formatted, 'HH:mm', site_timezone);
            let m_end_date = m_end_time.clone().startOf('day');
            ev.end_time = m_end_time.diff(m_end_date, 'seconds');

            let unix_timestamp = Math.round(Date.now() / 1000);

            let new_e = {
                _id: ObjectId(),
                start_time: ev.start_time,
                end_time: ev.end_time,
                title: ev.title,
                type: ev.type,
                speaker_name: ev.speaker_name,
                speaker_link: ev.speaker_link,
                location: ev.location,
                questions_allowed: ev.questions_allowed,
                ratings_allowed: ev.ratings_allowed,
                last_change: unix_timestamp,
            };

            sessions.findOneAndUpdate({
                _id: ObjectId(session_id)
            }, {
                $push: {
                    'events': {
                        $each: [new_e],
                        $sort: { 'start_time': 1 }
                    },
                }
            }, {
                returnOriginal: false,
            }, function(update_err, update_r) {
                if( typeof cb == "function" ) {
                    if( update_err ) {
                        console.error( update_err );
                        cb( update_err, false );
                    }
                    else {
                        //console.log( 'updated value:' );
                        //console.log( update_r );
                        cb( update_err, update_r.ok, update_r.value );
                    }
                }
            });
        });
    });
}

module.exports.editEvent = function( fingerprint, session_id, ev, cb ) {
    this.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let site_timezone = site_settings.timezone;

        sessions.findOne({
            'events._id': ObjectId(ev._id)
        }, {}, function( find_err, find_r ) {
            if( find_err || !find_r )
                return;

            let m_start_time = moment.tz(ev.start_time_formatted, 'HH:mm', site_timezone);
            let m_start_date = m_start_time.clone().startOf('day');
            ev.start_time = m_start_time.diff(m_start_date, 'seconds');

            let m_end_time = moment.tz(ev.end_time_formatted, 'HH:mm', site_timezone);
            let m_end_date = m_end_time.clone().startOf('day');
            ev.end_time = m_end_time.diff(m_end_date, 'seconds');

            let unix_timestamp = Math.round(Date.now() / 1000);

            if( find_r._id.str == session_id ) {
                // session stays the same, editing in place

                sessions.findOneAndUpdate({
                    'events._id': ObjectId(ev._id)
                }, {
                    $set: {
                        'events.$.start_time': ev.start_time,
                        'events.$.end_time': ev.end_time,
                        'events.$.title': ev.title,
                        'events.$.type': ev.type,
                        'events.$.speaker_name': ev.speaker_name,
                        'events.$.speaker_link': ev.speaker_link,
                        'events.$.location': ev.location,
                        'events.$.questions_allowed': ev.questions_allowed,
                        'events.$.ratings_allowed': ev.ratings_allowed,
                        'events.$.last_change': unix_timestamp,
                    }
                }, {
                    returnOriginal: false,
                }, function( update_err, update_r ) {
                    if( typeof cb == "function" ) {
                        if( update_err ) {
                            cb( update_err, false );
                        }
                        else {
                            cb( update_err, update_r.ok, update_r.value.events[0] );
                        }
                    }
                });
            } else {
                // we're moving the event into another session

                sessions.updateOne({
                    '_id': find_r._id
                }, {
                    $pull: {
                        'events': {
                            _id: ObjectId(ev._id)
                        }
                    }
                }, {}, function(delete_err, delete_r) {
                    if( delete_r.modifiedCount <= 0 )
                        return;

                    let new_e = {
                        _id: ObjectId(ev._id),
                        start_time: ev.start_time,
                        end_time: ev.end_time,
                        title: ev.title,
                        type: ev.type,
                        speaker_name: ev.speaker_name,
                        speaker_link: ev.speaker_link,
                        location: ev.location,
                        questions_allowed: ev.questions_allowed,
                        ratings_allowed: ev.ratings_allowed,
                        last_change: unix_timestamp,
                    };

                    sessions.findOneAndUpdate({
                        _id: ObjectId(session_id)
                    }, {
                        $push: {
                            'events': {
                                $each: [new_e],
                                $sort: { 'start_time': 1 }
                            },
                        }
                    }, {
                        returnOriginal: false,
                    }, function( update_err, update_r ) {
                        if( typeof cb == "function" ) {
                            if( update_err )
                                cb( update_err, false );
                            else
                                cb( update_err, update_r.ok, update_r.value.events[0] );
                        }
                    });
                });
            }
        });
    });
}

module.exports.deleteEvent = function( fingerprint, event_id, cb ) {
	sessions.findOneAndUpdate({
		'events._id': ObjectId(event_id)
	}, {
		$pull: {
			'events': {
				_id: ObjectId(event_id)
			}
		}
	}, {
		returnOriginal: false,
	}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value );
		}
	});
}

module.exports.editEventSpeaker = function( old_link, new_link, new_name, cb ) {
	let setting = {
		'events.$.speaker_link': new_link,
	};
	if( new_name !== undefined ) {
		setting['events.$.speaker_name'] = new_name;
	}

	return sessions.updateMany({
		'events.speaker_link': old_link
	}, {
		$set: setting
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, true );
		}
	});
}

// ---- feedback ---- //
module.exports.postFeedback = function( fingerprint, block_id, answer_values, cb ) {
	feedback.findOneAndUpdate({
		_id: ObjectId(block_id),
		'answers.user_id': fingerprint
	}, {
		$set: {
			'answers.$.values': answer_values
		}
	}, {
		returnOriginal: false,
	}, function(err, r) {
        //console.log('postFeedback query 1: ', r);

		if( r.value ) {
			if( typeof cb == "function" ) {
				if( err )
					cb( err, false );
				else
					cb( err, r.ok, r.value );
			}

			return;
		}

		feedback.findOneAndUpdate({
			_id: ObjectId(block_id)
		}, {
			$push: {
				'answers': {
					'user_id': fingerprint,
					'values': answer_values
				}
			}
		}, {
			returnOriginal: false,
		}, function(err, r) {
            //console.log('postFeedback query 2: ', r);

			if( typeof cb == "function" ) {
				if( err )
					cb( err, false );
				else
					cb( err, r.ok, r.value );
			}
		});
	});
}

// ---- event rating ---- //
module.exports.updateEventRating = function( fingerprint, event_id, rating, cb ) {
	return ratings.updateOne({
		'event_id': event_id,
		'user_id': fingerprint
	}, {
		$set: {
			'rating': rating
		}
	}, {}, function(err, r) {
		//console.log('ratings.updateOne', r);

		if( r.matchedCount ) {
			if( typeof cb == "function" ) {
				if( err )
					cb( err, false );
				else
					cb( err, (r.matchedCount > 0), {
						'user_id': fingerprint,
						'event_id': event_id,
						'rating': rating,
					});
			}
			
			return;
		}

		ratings.insertOne({
			'user_id': fingerprint,
			'event_id': event_id,
			'rating': rating,
		}, {}, function(err, r) {
			//console.log('ratings.insertOne', r);

			if( typeof cb == "function" ) {
				if( err )
					cb( err, false );
				else
					cb( err, (r.insertedCount > 0), r.ops[0] );
			}
		});
	});
}

// ---- event questions ---- //
module.exports.addNewQuestion = function( fingerprint, event_id, question_text, cb ) {
	questions.insertOne({
		_id: ObjectId(),
		event_id: event_id,
		user_id: fingerprint,
		added_time: Math.round(Date.now()/1000),
		voters: [fingerprint],
		text: question_text.trim(),
		accepted: false,
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, (r.insertedCount > 0), r.ops[0] );
		}
	});
}

module.exports.removeQuestion = function( fingerprint, question_id, cb ) {
	return questions.findOneAndDelete({
		_id: ObjectId(question_id)
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value );
		}
	});
}

module.exports.markQuestionAccepted = function( fingerprint, question_id, cb ) {
	questions.findOneAndUpdate({
		'_id': ObjectId(question_id)
	}, {
		$set: {
			'accepted': true
		}
	}, {
		returnOriginal: false
	}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value );
		}
	});
}

module.exports.editQuestion = function( fingerprint, question_id, question_text, question_accepted, cb ) {
	questions.findOneAndUpdate({
		'_id': ObjectId(question_id)
	}, {
		$set: {
			'text': question_text.trim(),
			'accepted': question_accepted,
		}
	}, {
		returnOriginal: false,
	}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value );
		}
	});
}

// ---- speakers ---- //
module.exports.compareSpeakers = function( sa, sb ) {
	// first order by names
	let compare_names = sa.name.localeCompare(sb.name);
	if( compare_names != 0 ) return compare_names;

	// order by department
	let compare_deps = sa.department.localeCompare(sb.department);
	if( compare_deps != 0 ) return compare_deps;

	// order by position or fail
	return sa.position.localeCompare(sb.position);
}

module.exports.getSpeakers = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

	speakers
	.find({}, {})
	.sort({ 'order_num' : 1 })
	.toArray(function(err, r) {
		if( err )
			cb( err, false );
		else
			cb( err, true, r );
	});
}

module.exports.transliterate = function( source ) {
    return translit().transform( source.trim(), '-' ).toLowerCase().replace(/[^A-Za-z_:.-]/g,"");
}

module.exports.createUniqueSpeakerLink = function( new_link, original_link, index, cb ) {
	// no point in performing the query if there is no callback
	if( typeof cb !== "function" )
		return;

	if( index > 100 )
		cb( err, false );

	let possible_speaker_link = new_link;
	if( index > 0 )
		possible_speaker_link += '-'+index;

	let that = this;

	speakers.findOne({
		link: possible_speaker_link
	}, {
		projection: {
			link: 1
		}
	}, function(err, r) {
		if( err )
			cb( err, false );
		else {
			if( !r || r.link == original_link ) {
				cb( err, true, possible_speaker_link );
			} else {
				that.createUniqueSpeakerLink( new_link, original_link, index+1, cb );
			}
		}
	});
}

module.exports.addNewSpeaker = function( fingerprint, speaker_data, cb ) {
	this.createUniqueSpeakerLink(
		this.transliterate( speaker_data.name ),
		null,
		0,
		function( err, ok, new_speaker_link ) {
			//console.log('createUniqueSpeakerLink: '+new_speaker_link);

			if( !ok ) {
				if( typeof cb == "function" )
					cb( err, false );

				return;
			}

			let new_speaker = {
				_id: ObjectId(),
				link: new_speaker_link,
				name: speaker_data.name.trim(),
				order_num: parseInt( speaker_data.order_num, 10 ),
				department: speaker_data.department,
				position: speaker_data.position,
				biography: speaker_data.biography,
			};

			if( speaker_data.photo_path )
				new_speaker.photo = speaker_data.photo_path;

			speakers.insertOne(new_speaker, {}, function(err, r) {
				//console.log('speakers.insertOne: '+r);

				if( typeof cb == "function" ) {
					if( err )
						cb( err, false );
					else
						cb( err, (r.insertedCount > 0), r.ops[0] );
				}
			});
		}
	);
}

module.exports.editSpeaker = function( fingerprint, speaker_data, cb ) {
	let that = this;

	this.createUniqueSpeakerLink(
		this.transliterate( speaker_data.name ),
		speaker_data.link,
		0,
		function( err, ok, new_speaker_link ) {
			if( !ok ) {
				if( typeof cb == "function" )
					cb( err, ok );

				return;
			}

			let edited_speaker = {
				link: new_speaker_link,
				name: speaker_data.name.trim(),
				order_num: parseInt( speaker_data.order_num, 10 ),
				department: speaker_data.department,
				position: speaker_data.position,
				biography: speaker_data.biography,
			};

			if( speaker_data.photo_path || speaker_data.delete_photo ) {
				edited_speaker['photo'] = speaker_data.photo_path;
			}

			speakers.findOneAndUpdate({
				link: speaker_data.link
			},{
				$set: edited_speaker
			}, {
				returnOriginal: true,	// !!!
			}, function(err, r) {
				if( typeof cb == "function" ) {
					if( err ) {
						cb( err, false );
						return;
					}

					if( r.value.photo !== edited_speaker.photo && typeof r.value.photo == "string" ) {
						// we need to check if any other speaker has the same photo attached and only if not, we can delete the file
						speakers.findOne({
							photo: r.value.photo
						}, {}, function(err_others, r_others) {
							if(!err_others && !r_others) {
								console.log('file upload: no more speakers with same photo, deleting');

								// delete previous file
								try {
									fs.unlink( path.join(uploadDir, r.value.photo), function(err){} );
								}
								catch(e) {
									// do nothing
								}
							} else {
								console.log('file upload: error or there are still speakers with the same photo');
							}
						});
					}

					that.editEventSpeaker( speaker_data.link, new_speaker_link, speaker_data.name );
					cb( err, r.ok, edited_speaker );
				}
			});
		}
	);
}

module.exports.deleteSpeaker = function( fingerprint, speaker_link, cb ) {
	let that = this;

	speakers.findOneAndDelete({
		link: speaker_link
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			//console.log('speakers.findOneAndUpdate: ', r);

			if( err ) {
				cb( err, false );
				return;
			}

            if( !r.value ) {
                cb( null, false );
                return;
            }

			if( typeof r.value.photo == "string" ) {
				// we need to check if any other speaker has the same photo attached and only if not, we can delete the file
				speakers.findOne({
					photo: r.value.photo
				}, {}, function(err_others, r_others) {
					if(!err_others && !r_others) {
						console.log('file upload: no more speakers with same photo, deleting');

						// delete previous file
						try {
							fs.unlink( path.join(uploadDir, r.value.photo), function(err){} );
						}
						catch(e) {
							// do nothing
						}
					} else {
						console.log('file upload: error or there are still speakers with the same photo');
					}
				});
			}

			that.editEventSpeaker( speaker_link, null, undefined, function() {
				cb( err, r.ok, r.value );
			} );
		}
	});
}

// ---- schedule ---- //
module.exports.getAdminSchedule = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let site_timezone = site_settings.timezone;

        sessions.aggregate([
            {
                $group:
                    {
                        _id: "$date",
                        sessions: {
                            $push: "$$ROOT"
                        }
                    }
            },
            {
                $sort:
                    {
                        _id: 1,
                    }
            }
        ], {}, function(err, cursor) {
            if(err) {
                cb( err, false );
                return;
            }

            cursor.toArray(function(err, days) {
                if(err) {
                    cb( err, false );
                    return;
                }

                days.map(function(day) {
                    day.date = day._id;
                    day.date_formatted = moment.tz(day._id, 'YYYY-MM-DD', site_timezone).format('D MMMM, dddd');
                    day.date_input_formatted = day._id;
                    day.sessions.map(function(session) {
                        let session_date = moment.tz(session.date, 'YYYY-MM-DD', site_timezone);
                        session.date_input_formatted = session_date.format('YYYY-MM-DD');
                        session.events.map(function(ev) {
                            ev.start_time_formatted = session_date.clone().add(ev.start_time, 'seconds').format('HH:mm');
                            ev.end_time_formatted = session_date.clone().add(ev.end_time, 'seconds').format('HH:mm');
                            return ev;
                        });
                        return session;
                    });
                    return day;
                });

                cb( err, true, days );
            });
        });
    });
}

module.exports.getSchedule = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

    this.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let site_timezone = site_settings.timezone;

        sessions.aggregate([
            {
                $match: 
                    {
                        extra_session: false
                    }
            },
            {
                $group:
                    {
                        _id: "$date",
                        sessions: {
                            $push: "$$ROOT"
                        }
                    }
            },
            {
                $sort:
                    {
                        _id: 1,
                    }
            }
        ], {}, function(err, cursor) {
            if(err) {
                cb( err, false );
                return;
            }

            cursor.toArray(function(err, days) {
                if(err) {
                    cb( err, false );
                    return;
                }

                days.map(function(day) {
                    day.date = day._id;
                    let day_date = moment.unix(day._id).tz(site_timezone);
                    day.date_formatted = moment.tz(day._id, 'YYYY-MM-DD', 'UTC').format('D MMMM, dddd');
                    day.sessions.map(function(session) {
                        let session_date = moment.tz(session.date, 'YYYY-MM-DD', site_timezone);

                        session.events.map(function(ev) {
                            ev.start_time_formatted = session_date.clone().add(ev.start_time, 'seconds').format('HH:mm');
                            ev.end_time_formatted = session_date.clone().add(ev.end_time, 'seconds').format('HH:mm');

                            ev.start_stamp = session_date.clone().add(ev.start_time, 'seconds').utc().format().replace(/-|:/g, '');
                            ev.end_stamp = session_date.clone().add(ev.end_time, 'seconds').utc().format().replace(/-|:/g, '');
                            return ev;
                        });
                        return session;
                    });
                    return day;
                });

                cb( err, true, days );
            });
        });
    });
}

module.exports.getExtraSchedule = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let site_timezone = site_settings.timezone;

        sessions.aggregate([
            {
                $match: 
                    {
                        extra_session: true
                    }
            },
            {
                $group:
                    {
                        _id: "$date",
                        sessions: {
                            $push: "$$ROOT"
                        }
                    }
            },
            {
                $sort:
                    {
                        _id: 1,
                    }
            }
        ], {}, function(err, cursor) {
            if(err) {
                cb( err, false );
                return;
            }

            cursor.toArray(function(err, days) {
                if(err) {
                    cb( err, false );
                    return;
                }

                days.map(function(day) {
                    day.date = day._id;
                    let day_date = moment.unix(day._id).tz(site_timezone);
                    day.date_formatted = moment.tz(day._id, 'YYYY-MM-DD', 'UTC').format('D MMMM, dddd');
                    day.sessions.map(function(session) {
                        let session_date = moment.tz(session.date, 'YYYY-MM-DD', site_timezone);

                        session.events.map(function(ev) {
                            ev.start_time_formatted = session_date.clone().add(ev.start_time, 'seconds').format('HH:mm');
                            ev.end_time_formatted = session_date.clone().add(ev.end_time, 'seconds').format('HH:mm');

                            ev.start_stamp = session_date.clone().add(ev.start_time, 'seconds').utc().format().replace(/-|:/g, '');
                            ev.end_stamp = session_date.clone().add(ev.end_time, 'seconds').utc().format().replace(/-|:/g, '');
                            return ev;
                        });
                        return session;
                    });
                    return day;
                });

                cb( err, true, days );
            });
        });
    });
}

// ---- questions ---- //
module.exports.sortUserQuestions = function( qa,qb ) {
	// first order by accepted/rejected
	if (!qa.accepted && qb.accepted) return -1;
	if (qa.accepted && !qb.accepted) return 1;

	// order by voters_count
	if (qa.voters_count > qb.voters_count) return -1;
	if (qa.voters_count < qb.voters_count) return 1;

	// order by time added (oldest on top)
	if (qa.added_time < qb.added_time) return -1;
	if (qa.added_time > qb.added_time) return 1;

	return 0;
}

module.exports.sortModQuestions = function( qa,qb ) {
	// first order by accepted/rejected
	if (!qa.accepted && qb.accepted) return -1;
	if (qa.accepted && !qb.accepted) return 1;

	// order by time added (oldest on top)
	if (qa.added_time < qb.added_time) return -1;
	if (qa.added_time > qb.added_time) return 1;

	return 0;
}

module.exports.getQuestion = function( fingerprint, question_id, cb ) {
	if( typeof cb !== "function" )
		return;

	questions.findOne({
		_id: ObjectId(question_id)
	}, {}, function(err, r) {
		if( err )
			cb( err, false );
		else
			cb( err, true, r );
	});
}

module.exports.getAllQuestions = function( fingerprint, event_id ) {
	if( typeof cb !== "function" )
		return;

	questions.find({
		'event_id': ''+event_id
	}, {}).toArray(function(err, r) {
		if( err )
			cb( err, false );
		else
			cb( err, true, r );
	});
}

module.exports.getUserQuestions = function( fingerprint, event_id, cb ) {
	if( typeof cb !== "function" )
		return;

	questions.find({
		$and: [
			{ event_id: ''+event_id },
			{ $or: [
				{ 'accepted': true },
				{ 'user_id': fingerprint },
			] }
		],
	}, {}).toArray((err, r) => {
		if(err) {
			cb( err, false );
			return;
		}

		//console.log('getUserQuestions:', r);

		for( let i = 0; i < r.length; i++ ) {
			r[i].voted = (r[i].voters.indexOf(fingerprint) >= 0);
			r[i].voters_count = r[i].voters.length;
			r[i].owned = (r[i].user_id == fingerprint);
		}

		cb( err, true, r.sort(this.sortUserQuestions) );
	});
}

module.exports.getModQuestions = function( fingerprint, event_id, cb ) {
	if( typeof cb !== "function" )
		return;

	questions.find({
		'event_id': ''+event_id,
		//'accepted': false,
	}, {}).toArray((err, r) => {
		if(err) {
			cb( err, false );
			return;
		}

		cb( err, true, r.sort(this.sortModQuestions) );
	});
}

// ---- events ---- //
module.exports.getEvent = function( fingerprint, event_id, cb ) {
	if( typeof cb !== "function" )
		return;

	sessions.findOne({
		'events._id': ObjectId(event_id)
	}, {
		projection: {
            'date': 1,
			'events.$': 1
		}
	}, function(err, r) {
		if(err) {
			cb( err, false );
			return;
		}

		if( !r ) {
			cb( err, true, null );
            return;
		}

		if( !r.events ) {
			cb( err, true, null );
            return;
		}

		if( r.events.length ) {
            var evt = r.events[0];
            evt.date = r.date;
			cb( err, true, evt );
		} else {
			cb( err, true, null );
		}
	});
}

module.exports.getCurrentEvent = function( fingerprint, timestamp, cb ) {
	if( typeof cb !== "function" )
		return;

	timestamp = timestamp || Date.now();
	let m = moment(timestamp);

	let time = 3600*m.hours() + 60*m.minutes() + m.seconds();
	let date = m.startOf('day').format('YYYY-MM-DD');

    sessions.aggregate([
        {
            $project: {
                'date': 1,
                'extra_session': 1,
                'events': 1,
            }
        },
        {
            $unwind: "$events"
        },
        {
            $match: 
                {
                    'date': date,
                    'extra_session': false,
                    'events.start_time': { $lte: time },
                    'events.end_time': { $gt: time },
                }
        },
        {
            $sort:
                {
                    'events.type._id': -1,
                }
        },
        {
            $limit: 1,
        }
    ], {}, function(err, cursor) {
        if(err) {
            cb( err, false );
            return;
        }

        cursor.toArray(function(err, session_events) {
            if(err) {
                console.error('error while getting current event:', err);
                cb( err, false );
                return;
            }

            if( !session_events ) {
                cb( err, true, null );
                return;
            }

            if( !session_events.length ) {
                cb( err, true, null );
                return;
            }

            let current_event = session_events[0].events;

            ratings.findOne({
                'event_id': ''+current_event._id,
                'user_id': fingerprint,
            },{
                //'rating': 1,
            }, function(err, r_rating) {
                if(err) {
                    cb( err, true, current_event );
                    return;
                }

                if( r_rating )
                    current_event.rating = r_rating.rating || 0;

                cb( err, true, current_event );
            });
        });
    });

    /*
    sessions.findOne({
        'date': date,
        'extra_session': false,
        'events':
            {
                $elemMatch: {
                    'start_time': { $lte: time },
                    'end_time': { $gt: time }
                }
            }
    }, {
        projection: {
            'date': 1,
            'events':
                {
                    $elemMatch: {
                        'start_time': { $lte: time },
                        'end_time': { $gt: time }
                    }
                }
        }
	}, function(err, r_session) {
		if(err) {
			cb( err, false );
			return;
		}
		
		if( !r_session ) {
			cb( err, true, null );
			return;
		}

        if( !r_session.events ) {
            cb( err, true, null );
            return;
        }

		if( r_session.events.length ) {
            let sorted_sessions = r_session.events.sort(function(ea, eb) {
                // order by type (more important to the top)
                if (ea.type._id > eb.type._id) return -1;
                if (ea.type._id < eb.type._id) return 1;

                return 0;
            });

            //console.log('current event (date: '+r_session.date+', time: '+time+'): ', current_event);
			let current_event = sorted_sessions.events[0];

			ratings.findOne({
				'event_id': ''+current_event._id,
				'user_id': fingerprint,
			},{
				//'rating': 1,
			}, function(err, r_rating) {
				if(err) {
					cb( err, true, current_event );
					return;
				}

				if( r_rating )
					current_event.rating = r_rating.rating || 0;

				cb( err, true, current_event );
			});
		} else {
			cb( err, true, null );
		}
	});
    */
}

module.exports.getCurrentEventData = function( fingerprint, timestamp, cb ) {
    if( typeof cb !== "function" ) {
        return;
    }

    timestamp = timestamp || Date.now();

    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        let m = moment(timestamp).tz(site_settings.timezone);

        that.getCurrentEvent( fingerprint, timestamp, function( err_event, ok_event, current_event ) {
            if( !ok_event ) {
                console.error('Error getting current event: ', err_event);
                cb( err_event, false );
                return;
            }

            m.tz(site_settings.timezone);
            let current_time = 3600*m.hours() + 60*m.minutes() + m.seconds();
            let current_time_formatted = m.format('HH:mm');
            m.startOf('day'); // reset to the start of the day

            if (current_event) {
                let m2 = moment.tz(m.format('YYYY-MM-DD'), 'YYYY-MM-DD', site_settings.timezone);
                current_event.start_time_formatted = m2.clone().add(current_event.start_time, 'seconds').format('HH:mm');
                current_event.end_time_formatted = m2.clone().add(current_event.end_time, 'seconds').format('HH:mm');
            }

            let eventData = {
                fingerprint: fingerprint,
                settings: site_settings,
                current_date_formatted: m.format('D MMMM, dddd'),
                current_time: current_time,
                current_time_formatted: current_time_formatted,
                current_event: current_event,
            };

            that.getNextEvents( fingerprint, timestamp, 1, function( err_next, ok_next, next_events ) {
                if( ok_next ) {
                    let next_event = next_events[0];
                    if (next_event) {
                        let next_event_date = moment.unix(next_event.date).tz(site_settings.timezone);
                        next_event.start_time_formatted = next_event_date.clone().add(next_event.start_time, 'seconds').format('HH:mm');
                        next_event.end_time_formatted   = next_event_date.clone().add(next_event.end_time,   'seconds').format('HH:mm');
                    }
                    eventData.next_event = next_event;
                }

                if(!current_event) {
                    cb( err_next, true, eventData );
                    return;
                }

                that.getUserQuestions( fingerprint, current_event._id, function( err_questions, ok_questions, current_questions ) {
                    if( ok_questions ) {
                        eventData.current_questions = current_questions;
                    }

                    cb( err_questions, true, eventData );
                    return;
                });
            });
        });
    });
}

module.exports.getCurrentModEventData = function( fingerprint, timestamp, cb ) {
	if( typeof cb !== "function" ) {
		return;
	}

	timestamp = timestamp || Date.now();
    let m = moment(timestamp);

	let that = this;

	that.getCurrentEvent( fingerprint, timestamp, function( err_event, ok_event, current_event ) {
		//console.log('current_event: ', current_event);

		if( !ok_event ) {
			console.error(err_event);
			return;
		}

        let current_time = 3600*m.hours() + 60*m.minutes() + m.seconds();

		if( !current_event ) {
            cb( err_event, true, {
                fingerprint: fingerprint,
                current_date_formatted: m.format('D MMMM, dddd'),
                current_time: current_time,
                current_event: undefined,
            } );

			return;
		}

		that.getModQuestions( fingerprint, current_event._id, function( err_questions, ok_questions, mod_questions ) {
			//console.log('mod_questions: ', mod_questions);

			if( !ok_questions ) {
				console.error(err_questions);

				if( typeof cb == "function" )
					cb( err_questions, false );

				return;
			}

            that.getPreviousEvents( fingerprint, timestamp, function( err_prev, ok_prev, previous_events ) {
                //console.log('previous events: ', err_prev, ok_prev, previous_events);

                if( !ok_prev ) {
                    console.error(err_prev);

                    if( typeof cb == "function" ) {
                        cb( err_prev, true, {
                            fingerprint: fingerprint,
                            current_date_formatted: m.format('D MMMM, dddd'),
                            current_time: current_time,
                            current_event: current_event,
                            mod_questions: mod_questions,
                        } );
                    }

                    return;
                }

                cb( err_prev, true, {
                    fingerprint: fingerprint,
                    current_date_formatted: m.format('D MMMM, dddd'),
                    current_time: current_time,
                    current_event: current_event,
                    mod_questions: mod_questions,
                    previous_events: previous_events,
                } );
            });
		});
	});
}

module.exports.getFullFeedback = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

	feedback.find({
        // all
    }, {
		projection: {
            'num': 1,
            'title': 1,
            'comment': 1,
            'questions': 1,
            'answers.values': 1,
        }
	})
    .sort({ 'num' : 1 })
    .toArray(function(err, r) {
		if(err) {
			cb( err, false );
			return;
		}

		if( !r ) {
			cb( err, true, [] );
			return;
		}

        for( let b_index = 0; b_index < r.length; b_index++ ) {
            for( let q_index = 0; q_index < r[b_index].questions.length; q_index++ ) {
                if( r[b_index].questions[q_index].type == 'variants' ) {
                    let answers_stat = [];

                    for( let v_index = 0; v_index < r[b_index].questions[q_index].variants.length; v_index++ ) {
                        answers_stat[v_index] = 0;
                    }

                    for( let a_index = 0; a_index < r[b_index].answers.length; a_index++ ) {
                        //answers_stat[r[b_index].questions[q_index].variants.indexOf(r[b_index].answers[a_index].values[q_index])] += 1;
                        answers_stat[parseInt(r[b_index].answers[a_index].values[q_index], 10)] += 1;
                    }

                    r[b_index].questions[q_index].statistics = answers_stat;
                } else if( r[b_index].questions[q_index].type == 'text' ) {
                    let texts = [];

                    for( let a_index = 0; a_index < r[b_index].answers.length; a_index++ ) {
                        let txt = r[b_index].answers[a_index].values[q_index].trim();
                        if( txt.length ) {
                            texts.push( txt );
                        }
                    }

                    r[b_index].questions[q_index].texts = texts;
                }

                r[b_index].questions[q_index].answers = null;
            }
        }

		cb( err, true, r );
	});
}

module.exports.getFeedback = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

	feedback.find({
        // all
    }, {
		projection: {
            'num': 1,
            'title': 1,
            'comment': 1,
            'questions': 1,
            'answers': {
                $elemMatch: {
                    'user_id': fingerprint,
                },
            },
        }
	})
    .sort({ 'num' : 1 })
    .toArray(function(err, r) {
		if(err) {
			cb( err, false );
			return;
		}

		if( !r ) {
			cb( err, true, [] );
			return;
		}

		for( let i = 0; i < r.length; i++ ) {
            if( r[i].answers ) {
                if( r[i].answers.length > 0 ) {
                    r[i].answers = r[i].answers[0].values;
                }
            } else {
                r[i].answers = [];
            }
		}

		cb( err, true, r );
	});
}

module.exports.getPreviousEvent = function( fingerprint, timestamp, cb ) {
	if( typeof cb !== "function" )
		return;

	timestamp = timestamp || Date.now();
	let m = moment(timestamp);

	let time = 3600*m.hours() + 60*m.minutes() + m.seconds();
	let date = m.startOf('day').unix();

	sessions.find({
		'date': date,
		'events.end_time': { $lte: time }
    }, {
		projection: {
            'date': 1,
            'events': 1,
        }
	})
    .toArray(function(err, r_sessions) {
		if(err) {
			cb( err, false );
			return;
		}

		if( !r_sessions ) {
			cb( err, true, undefined );
			return;
		}

        if( r_sessions.length <= 0 ) {
			cb( err, true, undefined );
			return;
        }

        let session = r_sessions[0];

        if( session.events.length <= 0 ) {
			cb( err, true, undefined );
			return;
        }

        let sorted_events = session.events.sort(function(ea, eb) {
            // first order by end_time
            if (ea.end_time > eb.end_time) return -1;
            if (ea.end_time < eb.end_time) return 1;

            // order by type (more important to the top)
            if (ea.type._id > eb.type._id) return -1;
            if (ea.type._id < eb.type._id) return 1;

            return 0;
        });

		cb( err, true, sorted_events[0] );
	});
}

module.exports.getPreviousEvents = function( fingerprint, timestamp, cb ) {
	if( typeof cb !== "function" )
		return;

	timestamp = timestamp || Date.now();
	let m = moment(timestamp);

	let time = 3600*m.hours() + 60*m.minutes() + m.seconds();
	let date = m.startOf('day').unix();

    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        sessions.aggregate([
            {
                $match: 
                    {
                        'date': date,
                        'extra_session': false,
                        'events.questions_allowed': true,
                    }
            },/*
            {
                $group:
                    {
                        _id: "$date",
                        sessions: {
                            $push: "$$ROOT"
                        }
                    }
            },*/
            {
                $unwind: "$events"
            },
            {
                $match: 
                    {
                        'events.end_time': { $lte: time },
                        'events.questions_allowed': true,
                    }
            },
            {
                $sort:
                    {
                        'events.end_time': -1,
                    }
            }
        ], {}, function(err, cursor) {
            if(err) {
                cb( err, false );
                return;
            }

            cursor.toArray(function(err, session_events) {
                if(err) {
                    console.error('error while getting previous events:', err);
                    cb( err, false );
                    return;
                }

                //console.log('previous events '+date+':', session_events);

                let previous_events = session_events.map(function(session_event) {
                    return {
                        _id: session_event.events._id,
                        date_formatted: moment.unix(session_event.date).tz(site_settings.timezone).format('D MMMM, dddd'),
                        title: session_event.events.title,
                        start_time: session_event.events.start_time,
                        end_time: session_event.events.end_time,
                        questions_allowed: session_event.events.questions_allowed,
                    };
                });

                cb( err, true, previous_events );
            });
        });
    });
}

module.exports.getNextEvents = function( fingerprint, timestamp, limit, cb ) {
	if( typeof cb !== "function" )
		return;

	timestamp = timestamp || Date.now();
	let m = moment(timestamp);

	let time = 3600*m.hours() + 60*m.minutes() + m.seconds();
	let date = moment.tz(m.format('YYYY-MM-DD'), 'YYYY-MM-DD', 'UTC').format('YYYY-MM-DD');
    m.startOf('day');

    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        sessions.aggregate([
            {
                $match: 
                    {
                        'date': { $gte: date },
                        'extra_session': false,
                    }
            },
            {
                $unwind: "$events"
            },
            {
                $addFields:
                {
                    unix:
                        {
                            $add: [ m.unix(), "$events.start_time" ]
                        }
                }
            },
            {
                $match:
                    {
                        'unix': { $gt: Math.round(timestamp/1000) },
                    }
            },
            {
                $sort:
                    {
                        'unix': 1,
                        'events.type._id': -1,
                    }
            },
            {
                $limit: limit,
            }
        ], {}, function(err, cursor) {
            if(err) {
                cb( err, false );
                return;
            }

            cursor.toArray(function(err, session_events) {
                if(err) {
                    console.error('error while getting future events:', err);
                    cb( err, false );
                    return;
                }

                //console.log('next events '+date+':', session_events);
                //console.log('next events matched for '+Math.round(timestamp/1000)+':', session_events.length);
                //console.log('next event matched :', session_events[0]);

                let future_events = session_events.map(function(session_event) {
                    let ev = session_event.events;
                    ev.date = session_event.date;
                    let session_date = moment.tz(session_event.date, 'YYYY-MM-DD', 'UTC');
                    ev.date_formatted = session_date.format('D MMMM, dddd');
					ev.start_time_formatted = session_date.clone().add(ev.start_time, 'seconds');
					ev.end_time_formatted = session_date.clone().add(ev.end_time, 'seconds');

                    return ev;
                });

                cb( err, true, future_events );
            });
        });
    });
}

// ---- question votes ---- //
/*module.exports.filterQuestions = function( fingerprint, questions ) {
	return questions.reduce((result, question) => {
		if( question.accepted || question.user_id == fingerprint ) {
			question.owned = true;
			result.push({
				question_id: question.question_id,
				voted: (question.voters.indexOf(fingerprint) >= 0),
				owned: (question.user_id == fingerprint),
				voters_count: question.voters.length,
				text: question.text
			});
		}

		return result;
	}, []);
}*/

module.exports.questionVoteAdd = function( fingerprint, question_id, cb ) {
	questions.findOneAndUpdate({
		_id: ObjectId(question_id)
	}, {
		$addToSet: {
			'voters': fingerprint,
		}
	}, {
		returnOriginal: false,
	}, function(err, r) {
		//console.log(r.value);

		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value.voters.length );
		}
	});
}

module.exports.questionVoteRemove = function( fingerprint, question_id, cb ) {
	questions.findOneAndUpdate({
		_id: ObjectId(question_id)
	}, {
		$pull: {
			'voters': fingerprint,
		}
	}, {
		returnOriginal: false,
	}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value.voters.length );
		}
	});
}

// ---- flights ---- //

module.exports.compareFlights = function( fa, fb ) {
	// order by checkout time
	if (fa.checkout_time < fb.checkout_time) return -1;
	if (fa.checkout_time > fb.checkout_time) return 1;

	// order by transfer time
	if (fa.transfer_time < fb.transfer_time) return -1;
	if (fa.transfer_time > fb.transfer_time) return 1;

	// order by flight time
	if (fa.flight_time < fb.flight_time) return -1;
	if (fa.flight_time > fb.flight_time) return 1;

	return (fa.flight_id - fb.flight_id);
}

module.exports.getFlights = function( fingerprint, cb ) {
	if( typeof cb !== "function" )
		return;

    let that = this;

    that.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        flights.find({}, {
            sort: {
                'date': 1,
                'checkout_time': 1,
                'transfer_time': 1,
                'flight_time': 1,
            }
        }).toArray(function(flights_err, flights_r) {
            if( flights_err ) {
                cb( flights_err, false );
            }
            else {
                let site_timezone = site_settings.timezone;
                flights_r.map(function(flight) {
                    flight.date_formatted = moment.unix(flight.date).tz(site_timezone).format('D MMMM, dddd');
                    flight.date_input_formatted = moment.unix(flight.date).tz(site_timezone).format('YYYY-MM-DD');
                    flight.checkout_time_formatted = moment.unix(flight.checkout_time).tz(site_timezone).format('HH:mm');
                    flight.transfer_time_formatted = moment.unix(flight.transfer_time).tz(site_timezone).format('HH:mm');
                    flight.flight_time_formatted = moment.unix(flight.flight_time).tz(site_timezone).format('HH:mm');

                    return flight;
                });

                cb( flights_err, true, flights_r );
            }
        });
    });
}

module.exports.prepareFlightData = function( flight_data, timezone ) {
	let m_date = moment(flight_data.date_input_formatted, 'YYYY-MM-DD', timezone);
	let m_checkout_time = moment(flight_data.checkout_time_formatted, 'HH:mm');
	let m_transfer_time = moment(flight_data.transfer_time_formatted, 'HH:mm');
	let m_flight_time = moment(flight_data.flight_time_formatted, 'HH:mm');

	flight_data.date = m_date.unix();
	flight_data.checkout_time = m_date.hour(m_checkout_time.hours()).minutes(m_checkout_time.minutes()).unix();
	flight_data.transfer_time = m_date.hour(m_transfer_time.hours()).minutes(m_transfer_time.minutes()).unix();
	flight_data.flight_time = m_date.hour(m_flight_time.hours()).minutes(m_flight_time.minutes()).unix();

	return flight_data;
}

module.exports.addNewFlight = function( fingerprint, flight_data, cb ) {
    this.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        flight_data = this.prepareFlightData(flight_data, site_settings.timezone);

        flights.insertOne({
            _id: ObjectId(),
            flight_number: flight_data.flight_number,
            date: flight_data.date,
            checkout_time: flight_data.checkout_time,
            transfer_time: flight_data.transfer_time,
            flight_time: flight_data.flight_time,
        }, {}, function(err, r) {
            if( typeof cb == "function" ) {
                if( err )
                    cb( err, false );
                else
                    cb( err, (r.insertedCount > 0), r.ops[0] );
            }
        });
    });
}

module.exports.editFlight = function( fingerprint, flight_data, cb ) {
    this.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            console.error('Error getting settings: ', err_settings);
            return;
        }

        flight_data = this.prepareFlightData(flight_data, site_settings.timezone);

        flights.findOneAndUpdate({
            _id: ObjectId(flight_data._id)
        },{
            $set: {
                flight_number: flight_data.flight_number,
                date: flight_data.date,
                checkout_time: flight_data.checkout_time,
                transfer_time: flight_data.transfer_time,
                flight_time: flight_data.flight_time,
            }
        }, {
            returnOriginal: false,
        }, function(err, r) {
            if( typeof cb == "function" ) {
                if( err ) {
                    cb( err, false );
                    return;
                }

                cb( err, r.ok, r.value );
            }
        });
    });
}

module.exports.deleteFlight = function( fingerprint, flight_id, cb ) {
	flights.findOneAndDelete({
		_id: ObjectId(flight_id)
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err )
				cb( err, false );
			else
				cb( err, r.ok, r.value );
		}
	});
}

// ---- contacts ---- //

module.exports.compareContacts = function( ca, cb ) {
	// order by 'order number' field
	if (ca.order_num < cb.order_num) return -1;
	if (ca.order_num > cb.order_num) return 1;

	return (ca.contact_id - cb.contact_id);
}

module.exports.getContacts = function( fingerprint, cb ) {
	//var libphonenumber = require('libphonenumber-js');
	// this function is a supersimplified libphonenumber.parseNumber( phoneNumber, 'International' )
	function formatNumber( phoneNumber ) {
		var lenPhone = phoneNumber.length;
		var digits = phoneNumber.split('');
		if( lenPhone == 12 ) {
			digits.splice(2,"", " (");
			digits.splice(6,"", ") ");
			digits.splice(10,"", "-");
			digits.splice(13,"", "-");
		} else if( lenPhone == 13 ) {
			digits.splice(3,"", " (");
			digits.splice(7,"", ") ");
			digits.splice(11,"", "-");
			digits.splice(14,"", "-");
		}

		return digits.join('');
	}

	if( typeof cb !== "function" )
		return;

	contacts.find({}, {}).toArray(function(contacts_err, contacts_r) {
		if( contacts_err )
			cb( contacts_err, false );
		else {
			contacts_r.map(function(contact) {
				contact.phone_number_formatted = formatNumber(contact.phone_number);
				return contact;
			});

			cb( contacts_err, true, contacts_r );
		}
	});
}

module.exports.addNewContact = function( fingerprint, contact_data, cb ) {
	contacts.insertOne({
		_id: ObjectId(),
		order_num: parseInt( contact_data.order_num, 10 ),
		name: contact_data.name,
		phone_number: contact_data.phone_number,
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err ) {
				cb( err, false );
			}
			else {
				cb( err, (r.insertedCount > 0), r.ops[0] );
			}
		}
	});
}

module.exports.editContact = function( fingerprint, contact_data, cb ) {
	contacts.findOneAndUpdate({
		_id: ObjectId(contact_data._id)
	},{
		$set: {
			order_num: parseInt( contact_data.order_num, 10 ),
			name: contact_data.name,
			phone_number: contact_data.phone_number,
		}
	}, {
		returnOriginal: false,
	}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err ) {
				cb( err, false );
				return;
			}

			cb( err, r.ok, r.value );
		}
	});
}

module.exports.deleteContact = function( fingerprint, contact_id, cb ) {
	contacts.findOneAndDelete({
		_id: ObjectId(contact_id)
	}, {}, function(err, r) {
		if( typeof cb == "function" ) {
			if( err ) {
				cb( err, false );
			}
			else {
				cb( err, r.ok, r.value );
			}
		}
	});
}