var template = require('./schedule.marko');
var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    database.getSettings(function( err, ok, site_settings ) {
        if(!ok) {
            res.status(500).end();
            return;
        }

        database.getSchedule(
            req.fingerprint,
            function( err, ok, days ) {
                if(!ok) {
                    res.status(500).end();
                    return;
                }

                res.marko( template, {
                    fingerprint: req.fingerprint,
                    settings: site_settings,
                    schedule: days
                });
            }
        );
    });
};