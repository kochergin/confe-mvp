var template = require('./now.marko');

function timeToHHMM( time ) {
	return ('00'+Math.floor(time/3600)%24).slice(-2)+':'+('00'+Math.floor((time%3600)/60)).slice(-2);
}

function timeToMM( time ) {
	return Math.floor(time/60);
}

var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    let holdEvent = req.app.locals.holding_event;

    database.getCurrentEventData(
        req.fingerprint,
        holdEvent,
        function( err, ok, eventData ) {
            if(!ok) {
                res.status(500).end();
                return;
            }

            if (holdEvent) {
                let eventDataTemplate = database.getCurrentEventDataTemplate(Date.now(), eventData.settings.timezone);

                // we have to rewrite the data we got from db (since it's forged) and replace it with actual values
                Object.assign(eventData, eventDataTemplate);

                eventData.holding_current_event = true;
            }

            eventData.current_time_formatted = timeToHHMM(eventData.current_time + eventData.current_utc_offset);
            eventData.progress = 0;
            if(eventData.current_event) {
                // progress
                eventData.progress = ((eventData.current_time - eventData.current_event.start_time)/(eventData.current_event.end_time-eventData.current_event.start_time))*100;
                if( eventData.progress > 100 )
                    eventData.progress = 100;
                else if (eventData.progress < 0)
                    eventData.progress = 0;

                // formatted start time and end time:
                if (!eventData.current_event.start_time_formatted || !!eventData.current_event.end_time_formatted) {
                    eventData.current_event.start_time_formatted = timeToHHMM(eventData.current_event.start_time + eventData.current_utc_offset);
                    eventData.current_event.end_time_formatted = timeToHHMM(eventData.current_event.end_time + eventData.current_utc_offset);
                }

                if (holdEvent && (eventData.current_time - eventData.current_event.end_time) > 60) {
                    eventData.overtime_formatted = timeToMM(eventData.current_time - eventData.current_event.end_time);
                } else {
                    eventData.overtime_formatted = '';
                }
            }

            if (eventData.current_questions && eventData.current_questions.length) {
                eventData.current_questions = eventData.current_questions
                    .filter((q) => q.user_id == req.fingerprint || q.status != 'new' )
                    .map((q) => {q.owned = q.user_id == req.fingerprint; return q;});
            }

            if(eventData.next_event && (!eventData.next_event.start_time_formatted || !!eventData.next_event.end_time_formatted)) {
                eventData.next_event.start_time_formatted = timeToHHMM(eventData.next_event.start_time + eventData.current_utc_offset);
                eventData.next_event.end_time_formatted = timeToHHMM(eventData.next_event.end_time + eventData.current_utc_offset);
            }

            res.marko( template, eventData );
        }
    );
};