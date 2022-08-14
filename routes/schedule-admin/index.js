var template = require('./schedule-admin.marko');
var template403 = require('../errors/403.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
	let is_admin = database.isAdmin(req.fingerprint);
	if( is_admin || database.isMod(req.fingerprint) ) {
		database.getAdminSchedule(
			req.fingerprint,
			function( err_schedule, ok_schedule, admin_schedule ) {
				if(!ok_schedule) {
					console.log(err_schedule);
					res.status(500).end();
				}

				database.getSpeakers(
					req.fingerprint,
					function( err_speakers, ok_speakers, speakers ) {
						if(!ok_speakers) {
							console.log(err_speakers);
							res.status(500).end();
						}

						res.marko( template, {
							fingerprint: req.fingerprint,
							is_admin: is_admin,
							event_types: database.getEventTypes(),
							admin_schedule: admin_schedule,
							speakers: speakers
						} );
					}
				);
			}
		);
	} else {
		res.status(403).marko( template403, {});
	}
};