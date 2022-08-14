var template = require('./info.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    database.getSettings(function( err_settings, ok_settings, site_settings ) {
        if(!ok_settings) {
            res.status(500).end();
            return;
        }

        database.getExtraSchedule(
            req.fingerprint,
            function( err_schedule, ok_schedule, extra_schedule ) {
                if(!ok_schedule) {
                    console.log(err_schedule);
                    res.status(500).end();
                    return;
                }

                if( !extra_schedule )
                    extra_schedule = [];

                database.getContacts(
                    req.fingerprint,
                    function( err_contacts, ok_contacts, contacts ) {
                        if(!ok_contacts) {
                            res.status(500).end();
                            return;
                        }

                        if( !contacts )
                            contacts = [];

                        database.getFlights(
                            req.fingerprint,
                            function( err_flights, ok_flights, flights ) {
                                if(!ok_flights) {
                                    res.status(500).end();
                                    return;
                                }

                                if( !flights )
                                    flights = [];

                                res.marko(template, {
                                    fingerprint: req.fingerprint,
                                    settings: site_settings,
                                    extra_schedule: extra_schedule,
                                    flights: flights,
                                    contacts: contacts,
                                } );
                            }
                        );
                    }
                )
            }
        );
    });
};