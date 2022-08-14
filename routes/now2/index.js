var template = require('./now.marko');

function timeToHHMM( time ) {
	return ('00'+Math.floor(time/3600)).slice(-2)+':'+('00'+Math.floor((time%3600)/60)).slice(-2);
}

var moment = require('moment');
moment.locale('ru');
var database = require('../../mongodb-database-v2.js');

module.exports = function(req, res) {
    database.getCurrentEventData(
        req.fingerprint,
        null,
        function( err, ok, eventData ) {
            if(!ok) {
                res.status(500).end();
                return;
            }

            eventData.current_time_formatted = timeToHHMM(eventData.current_time);
            eventData.progress = 0;
            if(eventData.current_event) {
                // progress
                eventData.progress = ((eventData.current_time - eventData.current_event.start_time)/(eventData.current_event.end_time-eventData.current_event.start_time))*100;
                if( eventData.progress > 100 )
                    eventData.progress = 100;
                else if (eventData.progress < 0)
                    eventData.progress = 0;

                // start time and end time:
                eventData.current_event.start_time_formatted = timeToHHMM(eventData.current_event.start_time);
                eventData.current_event.end_time_formatted = timeToHHMM(eventData.current_event.end_time);
            }

            res.marko( template, eventData );
        }
    );
};