var template = require('./questions.marko');

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    database.getSettings(function( err, ok, site_settings ) {
        if(!ok) {
            res.status(500).end();
            return;
        }

        if( req.query.event_id ) {
            database.getUserQuestions( null, req.query.event_id, function( err_questions, ok_questions, questions ) {
                if( !ok_questions ) {
                    console.error('Error getting questions: ', err_questions);
                    return;
                }

                if (questions && questions.length)
                    questions = questions.filter((q) => q.status == 'top' || q.status == 'accepted' || q.status == 'rejected' );

                if (!res.headersSent) {
                    res.marko( template, {
                        fingerprint: req.fingerprint,
                        settings: site_settings,
                        current_questions: questions || [],
                    } );
                }
            });
        } else {
            let holdEvent = req.app.locals.holding_event;

            database.getCurrentEventData(
                req.fingerprint,
                holdEvent,
                function( err, ok, eventData ) {
                    if(!ok) {
                        console.error('Error getting current questions: ', err);
                        res.status(500).end();
                        return;
                    }

                    if (eventData.current_questions && eventData.current_questions.length) {
                        eventData.current_questions = eventData.current_questions
                            .filter((q) => q.status == 'top' || q.status == 'accepted' );
                    }

                    res.marko( template, {
                        fingerprint: req.fingerprint,
                        settings: site_settings,
                        current_questions: eventData.current_questions || [],
                    } );
                }
            );
        }
    });
};