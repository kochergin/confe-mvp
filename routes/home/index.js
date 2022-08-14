var template = require('./home.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = async function(req, res) {
    try {
        let site_settings = await database.getSettingsAsync();
        res.marko( template, {
            fingerprint: req.fingerprint,
            settings: site_settings,
        });
    }
    catch(ex) {
        res.status(500).end();
    }
};

