var template = require('./info-admin.marko');
var template403 = require('../errors/403.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
	let is_admin = database.isAdmin(req.fingerprint);

	if( is_admin ) {
		database.getContacts(
			req.fingerprint,
			function( err_contacts, ok_contacts, contacts ) {
				if(!ok_contacts) {
					res.status(500).end();
					return;
				}

				database.getFlights(
					req.fingerprint,
					function( err_flights, ok_flights, flights ) {
						if(!ok_flights) {
							res.status(500).end();
							return;
						}

						res.marko(template, {
							is_admin: is_admin,
							fingerprint: req.fingerprint,
							admin_flights: flights,
							admin_contacts: contacts,
						} );
					}
				);
			}
		);
	} else {
		res.status(403).marko( template403, {});
	}
};