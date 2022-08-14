var template = require('./feedback-admin.marko');
var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    let is_admin = database.isAdmin(req.fingerprint);

	if( is_admin ) {
        database.getSettings(function( err_settings, ok_settings, site_settings ) {
            if(!ok_settings) {
                res.status(500).end();
                return;
            }

            database.getFullFeedback(
                req.fingerprint,
                function( err, ok, fb ) {
                    if(!ok) {
                        res.status(500).end();
                        return;
                    }

                    //console.log('received stats:', fb);

                    res.marko(template, {
                        is_admin: is_admin,
                        fingerprint: req.fingerprint,
                        settings: site_settings,
                        blocks: fb
                    });
                }
            );
        });
    }
};