function timeToHHMM( time ) {
	return ('00'+Math.floor(time/3600)).slice(-2)+':'+('00'+Math.floor((time%3600)/60)).slice(-2);
}

module.exports = class {
	onCreate() {
		this.state = {
			progress: null,
			current_time_formatted: null,
			current_event: null,
		};
        this.current_time = null;
	}
	onMount() {
		var $currentEvent = $(this.getEl('currentEvent'));
		var $questionSentSuccess = $(this.getEl('questionSentSuccess'));
		var $questionCannotBeSent = $(this.getEl('questionCannotBeSent'));
		var $questionRejected = $(this.getEl('questionRejected'));
		var $questions = $(this.getEl('questions'));
		var that = this;
        this.current_time = that.input.current_time;
        this.state.current_time_formatted = that.input.current_time_formatted;
        this.state.progress = that.input.progress;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=now', {
			// default settings
		});

		this.primus.on('open', function(opts) {
			that.online = true;
		});

		this.primus.on('reconnect scheduled', function(opts) {
			$questionCannotBeSent.collapse('show');
			that.online = false;
		});

		this.primus.on('reconnected', function(opts) {
			// request updated data

			$questionCannotBeSent.collapse('hide');
			that.online = true;

			this.write({
				fingerprint: that.input.fingerprint,
				message_type: 'current_event'
			});
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'current_event' ) {
				$currentEvent.addClass('fade').removeClass('collapse show');

				that.input.current_date_formatted = data.current_date_formatted;
                that.current_time = data.current_time;
                that.state.current_time_formatted = timeToHHMM(data.current_time);
				that.state.progress = data.progress;
				that.input.current_event = data.current_event;
				if(that.input.current_event) {
					that.input.current_event.start_time_formatted = timeToHHMM(data.current_event.start_time);
					that.input.current_event.end_time_formatted = timeToHHMM(data.current_event.end_time);
				}
				that.input.current_questions = data.current_questions;

				setTimeout(function() {
					that.forceUpdate();
					$currentEvent.addClass('show');
				}, 350);
			}
			if( data.message_type == 'no_current_event' ) {
				$currentEvent.removeClass('fade').addClass('collapse');

				that.input.current_event = null;
				that.input.current_questions = null;
				that.input.next_event = data.next_event;

				setTimeout(function() {
					that.forceUpdate();
					$currentEvent.addClass('show');
				}, 350);
			}
			if( data.message_type == 'give/rating/success' ) {
				that.input.current_event.rating = data.rating;
				that.forceUpdate();

				/* $ratingStatus.removeClass('text-secondary').addClass('text-success');
				$ratingStatus.html('✓');

				setTimeout(function() {
					$ratingStatus.addClass('fade').removeClass('show');
					$ratingStatus.html('');
				}, 1000); */
			}
			if( data.message_type == 'vote/question/success' ) {
				that.questionChangeVoteCount( data.question_id, data.voted, data.voters_count );
				that.forceUpdate();
			}
			if( data.message_type == 'new/question' ) {
				$questions.removeClass('show');

				let i = 0, question_found = false;
				while( i < that.input.current_questions.length ) {
					if( that.input.current_questions[i]._id == data.question.question_id ) {
						question_found = true;
						break;
					} else {
						i++;
					}
				}
				if( question_found ) {
					that.input.current_questions.splice(i, 1);
				}
				setTimeout(function() {
					that.input.current_questions.push(data.question);
					that.input.current_questions.sort(that.sortQuestions);
					that.forceUpdate();
					$questions.addClass('show');
				}, 150);
			}
			if( data.message_type == 'reject/question' ) {
				let i = 0, question_found = false;
				while( i < that.input.current_questions.length ) {
					if( that.input.current_questions[i].question_id == data.question_id ) {
						question_found = true;
						break;
					} else {
						i++;
					}
				}

				if(question_found) {
					$questionRejected.collapse('show');
					setTimeout(function() {
						$questionRejected.collapse('hide');
					}, 5000);

					$questions.removeClass('show');
					setTimeout(function() {
						that.input.current_questions.splice(i, 1);
						that.forceUpdate();
						$questions.addClass('show');
					}, 200);
				}
			}
			if( data.message_type == 'add/question/success' ) {
				$questionSentSuccess.collapse('show');
				setTimeout(function() {
					$questionSentSuccess.collapse('hide');
				}, 5000);
			}
		});

		setInterval(function() {
            that.current_time += 1;
			let new_time_formatted = timeToHHMM(that.current_time);

			let new_progress = 0;
			if( that.input.current_event ) {
				new_progress = ( 100*( that.current_time - that.input.current_event.start_time ) / ( that.input.current_event.end_time - that.input.current_event.start_time ) ) | 0;

				if( new_progress < 0 )
					new_progress = 0;
				else if( new_progress > 100 )
					new_progress = 100;
			}

			if( new_progress != that.state.progress || new_time_formatted != that.state.current_time_formatted ) {
                that.state.current_time_formatted = new_time_formatted;
                that.state.progress = new_progress;
			}
		}, 1000);
	}
    sortQuestions( qa,qb ) {
        // first order by accepted/rejected
        if (!qa.accepted && qb.accepted) return -1;
        if (qa.accepted && !qb.accepted) return 1;

        // order by voters_count
        if (qa.voters_count > qb.voters_count) return -1;
        if (qa.voters_count < qb.voters_count) return 1;

        // order by time added (oldest on top)
        if (qa.added_time < qb.added_time) return -1;
        if (qa.added_time > qb.added_time) return 1;

        return 0;
    }
	sendRatingForm( event_id, event ) {
		event.preventDefault();

		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'give/rating',
			event_id: event_id,
			rating: this.getEl("ratingForm").querySelector('input[name="eventRating"]:checked').value
		};

		this.primus.write(sendData);

		return false;
	}
	sendQuestionForm( event_id, event ) {
		event.preventDefault();
		console.log(event_id, event);

		let textArea = this.getEl('questionText');

		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'add/question',
			event_id: event_id,
			question_text: textArea.value,
		};

		this.primus.write(sendData);

		textArea.value = '';

		return false;
	}
	questionVote( question_id, voted, owned ) {
		console.log('trying to cast a vote ', question_id, voted, owned);

		if(owned)
			return;

		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: (voted)?'vote/question/remove':'vote/question/add',
			question_id: question_id
		};

		this.primus.write(sendData);
	}
	questionChangeVoteCount( question_id, voted, vote_count ) {
		for( let i = 0; i < this.input.current_questions.length; i++ ) {
			if( this.input.current_questions[i]._id != question_id ) {
				continue;
			}

			this.input.current_questions[i].voted = voted;
			this.input.current_questions[i].voters_count = vote_count;
			break;
		}

        this.input.current_questions.sort(this.sortQuestions);
	}
}