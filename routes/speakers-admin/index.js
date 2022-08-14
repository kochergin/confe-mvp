var template = require('./speakers-admin.marko');
var template403 = require('../errors/403.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
	let is_admin = database.isAdmin(req.fingerprint);
	if( is_admin ) {
		database.getSpeakers(
			req.fingerprint,
			function( err, ok, speakers ) {
				if(!ok) {
					res.status(500).end();
				}

				res.marko( template, {
					is_admin: is_admin,
					fingerprint: req.fingerprint,
					admin_speakers: speakers,
				});
			}
		);
	} else {
		res.status(403).marko( template403, {});
	}
};