var template = require('./feedback.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    database.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            res.status(500).end();
            return;
        }

        database.getFeedback(
            req.fingerprint,
            function( err, ok, fb ) {
                if(!ok) {
                    res.status(500).end();
                    return;
                }

                res.marko(template, {
                    fingerprint: req.fingerprint,
                    settings: site_settings,
                    blocks: fb
                });
            }
        );
    });
};