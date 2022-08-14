var template = require('./settings-admin.marko');
var template403 = require('../errors/403.marko');

var database = require('../../mongodb-database-v2.js');

var moment = require('moment-timezone');

function roundToTwo(x) {
    return +(Math.round(x + "e+2")  + "e-2");
}

module.exports = function(req, res) {
    let is_admin = database.isAdmin(req.fingerprint);

	if( is_admin ) {
        database.getSettings(function( err, ok, site_settings ) {
            if(!ok) {
                res.status(500).end();
                return;
            }

            let right_now = moment().valueOf();

            res.marko(template, {
                is_admin: is_admin,
                fingerprint: req.fingerprint,
                site_settings: site_settings,
                available_timezones: moment.tz.names().map((tz_name) => {
                    let utcOffsetMinutes = moment.tz.zone(tz_name).utcOffset(right_now);
                    return {
                        name: tz_name,
                        offset: roundToTwo(-utcOffsetMinutes / 60),
                    };
                })
            } );
		});
	} else {
		res.status(403).marko( template403, {});
	}
};