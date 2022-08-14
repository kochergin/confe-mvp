function timeToHHMM( time ) {
	return ('00'+Math.floor(time/3600)%24).slice(-2)+':'+('00'+Math.floor((time%3600)/60)).slice(-2);
}

function timeToMM( time ) {
	return Math.floor(time/60);
}

module.exports = class {
    onCreate(input) {
        this.state = {
            progress: input.progress,
            current_date_formatted: input.current_date_formatted,
            current_time_formatted: input.current_time_formatted,
            current_event: input.current_event,
            holding_current_event: input.holding_current_event,
            overtime_formatted: input.overtime_formatted || timeToMM(input.overtime) || '',
            current_questions: input.current_questions || [],
            next_event: input.next_event,
        };
        this.current_time = input.current_time;
        this.current_utc_offset = input.current_utc_offset;
        this.status_order = ['top', 'new', 'accepted', 'answered', 'rejected'];
    }
	onMount() {
		var $currentEvent = $(this.getEl('currentEvent'));
        var $nextEvent = $(this.getEl('nextEvent'));

        var ratingSubmitButton = this.getEl('ratingSendButton');
        var $ratingStatusBlock = $(this.getEl('ratingStatusBlock'));
        var $ratingStatusMessage = $(this.getEl('ratingStatusMessage'));

		var $questionSentSuccess = $(this.getEl('questionSentSuccess'));
		var $questionSentError = $(this.getEl('questionSentError'));
		var $questionCannotBeSent = $(this.getEl('questionCannotBeSent'));
		var $questionRejected = $(this.getEl('questionRejected'));
		var $questions = $(this.getEl('questions'));
		var that = this;

        if( that.state.current_event ) {
            if( that.state.current_event.rating ) {
                var rb = document.getElementById('eventRating'+that.state.current_event.rating);
                if( rb ) {
                    rb.checked = true;
                }
            }
        }

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
                $nextEvent.addClass('fade').removeClass('collapse show');

                // first let's deal with undefined UTC offset:
                that.current_utc_offset = data.current_utc_offset || 0;
                // current time should be converted from UTC
                that.current_time = data.current_time;

                if (data.current_time_formatted) {
                    that.state.current_time_formatted = data.current_time_formatted;
                } else {
                    that.state.current_time_formatted = timeToHHMM(data.current_time + that.current_utc_offset);
                }
                that.state.progress = data.progress;
                var update_rating = false;

                if( data.current_event ) {
                    that.state.holding_current_event = data.holding_current_event;

                    if (that.state.holding_current_event && (that.current_time - that.state.current_event.end_time) > 60) {
                        that.state.overtime_formatted = timeToMM(that.current_time - that.state.current_event.end_time);
                    } else {
                        that.state.overtime_formatted = '';
                    }

                    if (!data.current_event.start_time_formatted || !!data.current_event.end_time_formatted) {
                        data.current_event.start_time_formatted = timeToHHMM(data.current_event.start_time + that.current_utc_offset);
                        data.current_event.end_time_formatted = timeToHHMM(data.current_event.end_time + that.current_utc_offset);
                    }

                    if( that.state.current_event  ) {
                        if( that.state.current_event.rating != data.current_event.rating ) {
                            update_rating = true;
                        }
                    }
                }
                if(data.next_event && (!data.next_event.start_time_formatted || !!data.next_event.end_time_formatted)) {
                    data.next_event.start_time_formatted = timeToHHMM(data.next_event.start_time + that.current_utc_offset);
                    data.next_event.end_time_formatted = timeToHHMM(data.next_event.end_time + that.current_utc_offset);
                }
                that.state.current_event = data.current_event;
                that.state.current_questions = data.current_questions || [];
                that.state.next_event = data.next_event;

                that.setStateDirty("progress");
                that.setStateDirty("current_event");
                that.setStateDirty("current_questions");
                that.setStateDirty("next_event");

                that.once('update', function() {
                    setTimeout(function() {
                        if( update_rating ) {
                            var rbuttons = document.getElementsByClassName('event-rating-buttons');
                            for (var i = 0; i < rbuttons.length; i++) {
                                if( rbuttons[i].value == that.state.current_event.rating ) {
                                    rb.checked = true;
                                } else {
                                    rb.checked = false;
                                }
                            }
                        }
                        $currentEvent.addClass('show');
                        if(that.state.next_event) {
                            $nextEvent.addClass('show');
                        }
                    }, 350);
                });
			}
			if( data.message_type == 'no_current_event' ) {
				$currentEvent.removeClass('fade').addClass('collapse');
                $nextEvent.removeClass('fade').addClass('collapse');

                // first let's deal with undefined UTC offset:
                that.current_utc_offset = data.current_utc_offset || 0;
                // current time should be converted from UTC
                that.current_time = data.current_time;

                if (data.current_time_formatted) {
                    that.state.current_time_formatted = data.current_time_formatted;
                } else {
                    that.state.current_time_formatted = timeToHHMM(data.current_time + that.current_utc_offset);
                }

                that.state.progress = 0;
				that.state.current_event = null;
                that.state.current_questions = [];
                
                that.state.holding_current_event = false;
                that.state.overtime_formatted = '';

                if(data.next_event && (!data.next_event.start_time_formatted || !!data.next_event.end_time_formatted)) {
                    data.next_event.start_time_formatted = timeToHHMM(data.next_event.start_time + that.current_utc_offset);
                    data.next_event.end_time_formatted = timeToHHMM(data.next_event.end_time + that.current_utc_offset);
                }
                that.state.next_event = data.next_event;

                that.setStateDirty("progress");
                that.setStateDirty("current_event");
                that.setStateDirty("current_questions");
                that.setStateDirty("next_event");

                that.once('update', function() {
                    setTimeout(function() {
                        $currentEvent.addClass('show');
                        if(that.state.next_event) {
                            $nextEvent.addClass('show');
                        }
                    }, 350);
                });
			}
			if( data.message_type == 'give/rating/success' ) {
                if( that.state.current_event ) {
                    that.state.current_event.rating = data.rating;
                    ratingSubmitButton.removeAttribute('disabled');

                    $ratingStatusMessage.text('Спасибо! Ваша оценка успешно отправлена.');
                    $ratingStatusMessage.removeClass('alert-danger').addClass('alert-success');
                    $ratingStatusBlock.collapse('show');

                    setTimeout(function() {
                        $ratingStatusBlock.collapse('hide');
                        $ratingStatusBlock.text('');
                    }, 5000);
                }
			}
			if( data.message_type == 'give/rating/error' ) {
                if( that.state.current_event ) {
                    ratingSubmitButton.removeAttribute('disabled');

                    $ratingStatusMessage.text('Ошибка при отправке вопроса.');
                    $ratingStatusMessage.removeClass('alert-success').addClass('alert-danger');
                    $ratingStatusBlock.collapse('show');

                    setTimeout(function() {
                        $ratingStatusBlock.collapse('hide');
                        $ratingStatusBlock.text('');
                    }, 5000);
                }
			}
			if( data.message_type == 'question/vote/success' ) {
				that.questionChangeVoteCount( data.question_id, data.voted, data.voters_count );
			}
			if( data.message_type == 'question/new' || data.message_type == 'question/edit' ) {
                if( that.state.current_questions ) {
                    $questions.removeClass('show');

                    let i = 0, question_found = false;
                    while( i < that.state.current_questions.length ) {
                        if( that.state.current_questions[i]._id == data.question._id ) {
                            question_found = true;
                            break;
                        } else {
                            i++;
                        }
                    }

                    if( question_found ) {
                        that.state.current_questions.splice(i, 1);
                    }

                    that.state.current_questions.push(data.question);
                    that.state.current_questions.sort(that.sortQuestions.bind(that));
                    that.setStateDirty("current_questions");

                    setTimeout(function() {
                        $questions.addClass('show');
                    }, 200);
                }
			}
			if( data.message_type == 'question/delete' ) {
                if( that.state.current_questions ) {
                    let i = 0, question_found = false, question_owned = false;
                    while( i < that.state.current_questions.length ) {
                        if( that.state.current_questions[i]._id == data.question_id ) {
                            question_found = true;
                            question_owned = that.state.current_questions[i].owned;
                            break;
                        } else {
                            i++;
                        }
                    }

                    if(question_found) {
                        // show rejection notification if the user owned the question
                        if (question_owned && data.status == 'rejected') {
                            $questionRejected.collapse('show');
                            setTimeout(function() {
                                $questionRejected.collapse('hide');
                            }, 5000);
                        }

                        $questions.removeClass('show');

                        that.state.current_questions.splice(i, 1);
                        that.setStateDirty("current_questions");

                        setTimeout(function() {
                            $questions.addClass('show');
                        }, 200);
                    }
                }
            }
            if( data.message_type == 'question/new/success' ) {
                let questionSubmitButton = that.getEl('questionSendButton');
                
                if(questionSubmitButton) {
                    questionSubmitButton.removeAttribute('disabled');
                }

                $questionSentSuccess.collapse('show');
                setTimeout(function() {
                    $questionSentSuccess.collapse('hide');
                }, 5000);
            }
            if( data.message_type == 'question/new/error' ) {
                let questionSubmitButton = that.getEl('questionSendButton');

                if(questionSubmitButton) {
                    questionSubmitButton.removeAttribute('disabled');
                }

                $questionSentError.collapse('show');
                setTimeout(function() {
                    $questionSentError.collapse('hide');
                }, 5000);
            }
            if( data.message_type == 'question/edit/status' ) {
                $questions.removeClass('show');

                let i = 0, question_found = false;
                while( i < that.state.current_questions.length ) {
                    if( that.state.current_questions[i]._id == data.question_id ) {
                        that.state.current_questions[i].status = data.status;
                        break;
                    } else {
                        i++;
                    }
                }

                that.state.current_questions.sort(that.sortQuestions.bind(that));
                that.setStateDirty("current_questions");

                setTimeout(function() {
                    $questions.addClass('show');
                }, 200);
            }
        });

		setInterval(function() {
            that.current_time += 1;
			let new_time_formatted = timeToHHMM(that.current_time + that.current_utc_offset);

			let new_progress = 0;
			if( that.state.current_event ) {
				new_progress = ( 100*( that.current_time - that.state.current_event.start_time ) / ( that.state.current_event.end_time - that.state.current_event.start_time ) ) | 0;

				if( new_progress < 0 )
					new_progress = 0;
				else if( new_progress > 100 )
                    new_progress = 100;
                    
                if (that.state.holding_current_event && (that.current_time - that.state.current_event.end_time) > 60) {
                    that.state.overtime_formatted = timeToMM(that.current_time - that.state.current_event.end_time);
                } else {
                    that.state.overtime_formatted = '';
                }
			}

			if( new_progress != that.state.progress || new_time_formatted != that.state.current_time_formatted ) {
                that.state.current_time_formatted = new_time_formatted;
                that.state.progress = new_progress;
            }
		}, 1000);
	}
    sortQuestions( qa, qb ) {
        let qa_idx = this.status_order.indexOf(qa.status), qb_idx = this.status_order.indexOf(qb.status);

		// order: 'top', 'new', 'accepted', 'answered', 'rejected'
        if (qa_idx < qb_idx) return -1;
        if (qa_idx > qb_idx) return 1;

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

        var ratingSubmitButton = this.getEl('ratingSendButton');
        ratingSubmitButton.setAttribute('disabled', true);

		var sendData = {
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

        let questionSubmitButton = this.getEl('questionSendButton');
        questionSubmitButton.setAttribute('disabled', true);

		var textArea = this.getEl('questionText');

		var sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'question/new',
			event_id: event_id,
			question_text: textArea.value,
		};

		this.primus.write(sendData);

		textArea.value = '';

		return false;
	}
	questionVote( question_id, status, voted, owned ) {
		console.log('trying to cast a vote ', question_id, status, voted, owned);

		if(owned || status != 'accepted')
			return false;

		var sendData = {
			fingerprint: this.input.fingerprint,
			message_type: (voted)?'question/vote/remove':'question/vote/add',
			question_id: question_id
		};

		this.primus.write(sendData);
	}
	questionChangeVoteCount( question_id, voted, vote_count ) {
        var questions = this.state.current_questions;

		for( let i = 0; i < questions.length; i++ ) {
			if( questions[i]._id != question_id ) {
				continue;
			}

			questions[i].voted = voted;
			questions[i].voters_count = vote_count;
			break;
		}

        questions.sort(this.sortQuestions.bind(this));

        this.state.current_questions = questions;

        this.setStateDirty("current_questions");
	}
}