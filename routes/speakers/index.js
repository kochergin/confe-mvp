var template = require('./speakers.marko');
var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    database.getSettings(function( err, ok, site_settings ) {
        if(!ok) {
            res.status(500).end();
            return;
        }

        database.getSpeakers(
            req.fingerprint,
            function( err, ok, speakers ) {
                if(!ok) {
                    res.status(500).end();
                    return;
                }

                res.marko( template, {
                    fingerprint: req.fingerprint,
                    settings: site_settings,
                    speakers: speakers,
                });
            }
        );
    });
};