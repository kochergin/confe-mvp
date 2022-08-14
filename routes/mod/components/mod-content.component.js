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
			mod_questions: input.mod_questions,
			previous_events: input.previous_events,
            next_event: input.next_event,
		};
		this.current_time = input.current_time;
		this.current_utc_offset = input.current_utc_offset;
		this.status_order = ['top', 'new', 'accepted', 'answered', 'rejected'];
		this.possible_top_question_id = null;
	}
	onMount() {
		var $currentEvent = $(this.getEl('currentEvent'));
		var $questionSentSuccess = $(this.getEl('questionSentSuccess'));
		var $questionCannotBeSent = $(this.getEl('questionCannotBeSent'));
		var $questions = $(this.getEl('questions'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=mod', {
			// default
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
				message_type: 'mod_event'
			});
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'mod_event' ) {
				$currentEvent.addClass('fade').removeClass('collapse show');

                that.current_utc_offset = data.current_utc_offset;
                that.current_time = data.current_time;

                if (data.current_time_formatted) {
                    that.state.current_date_formatted = data.current_date_formatted;
                } else {
                    that.state.current_time_formatted = timeToHHMM(data.current_time + data.current_utc_offset);
                }
				that.state.progress = data.progress;

				if (data.current_event) {
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
				}
                that.state.current_event = data.current_event;
				that.state.mod_questions = data.mod_questions;

				that.setStateDirty("current_event");
				that.setStateDirty("mod_questions");

				that.once('update', function() {
					setTimeout(function() {
						$currentEvent.addClass('show');
					}, 350);
                });
			}
			if( data.message_type == 'no_current_event' ) {
				$currentEvent.removeClass('fade').addClass('collapse');

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
				that.state.mod_questions = null;

                if(data.next_event && (!data.next_event.start_time_formatted || !!data.next_event.end_time_formatted)) {
                    data.next_event.start_time_formatted = timeToHHMM(data.next_event.start_time + that.current_utc_offset);
                    data.next_event.end_time_formatted = timeToHHMM(data.next_event.end_time + that.current_utc_offset);
                }
				that.state.next_event = data.next_event;

				that.setStateDirty("current_event");
				that.setStateDirty("mod_questions");
				that.setStateDirty("next_event");

				that.once('update', function() {
					setTimeout(function() {
						$currentEvent.addClass('show');
					}, 350);
                });
			}
			if( data.message_type == 'mod/question/new' || data.message_type == 'mod/question/edit' ) {
                if( that.state.mod_questions ) {
                    $questions.removeClass('show');

                    let i = 0, question_found = false;
                    while( i < that.state.mod_questions.length ) {
                        if( that.state.mod_questions[i]._id == data.question._id ) {
                            question_found = true;
                            break;
                        } else {
                            i++;
                        }
                    }

                    if( question_found ) {
                        that.state.mod_questions.splice(i, 1);
                    }

                    that.state.mod_questions.push(data.question);
                    that.state.mod_questions.sort(that.sortQuestions.bind(that));
                    that.setStateDirty("mod_questions");

                    setTimeout(function() {
                        $questions.addClass('show');
                    }, 200);
                }
			}
			if( data.message_type == 'question/edit/status' ) {
				$questions.removeClass('show');

				$(that.getEl('topQuestionConfirmation')).modal('hide');

                let i = 0, question_found = false;
                while( i < that.state.mod_questions.length ) {
                    if( that.state.mod_questions[i]._id == data.question_id ) {
						that.state.mod_questions[i].status = data.status;
                        break;
                    } else {
                        i++;
                    }
                }

                that.state.mod_questions.sort(that.sortQuestions.bind(that));
                that.setStateDirty("mod_questions");

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
	holdEvent() {
		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'event/hold'
		};

		this.primus.write(sendData);
	}
	unholdEvent() {
		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'event/unhold'
		};

		this.primus.write(sendData);
	}
	setQuestionStatus( question_id, question_status ) {
		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'question/edit/status',
			question_id: question_id,
			status: question_status
		};

		this.primus.write(sendData);
	}
	sendQuestionToTop( question_id ) {
		let i = 0, current_top_question_id = null;
		while( i < this.state.mod_questions.length ) {
			if( this.state.mod_questions[i].status == 'top' ) {
				current_top_question_id = this.state.mod_questions[i]._id;
				break;
			} else {
				i++;
			}
		}

		if (current_top_question_id) {
			this.possible_top_question_id = question_id;
			$(this.getEl('topQuestionConfirmation')).modal('show');
		} else {
			this.setQuestionStatus(question_id, 'top');
		}
	}
	setTopQuestionStatus( new_status ) {
		let i = 0, current_top_question_id = null;
		while( i < this.state.mod_questions.length ) {
			if( this.state.mod_questions[i].status == 'top' ) {
				current_top_question_id = this.state.mod_questions[i]._id;
				break;
			} else {
				i++;
			}
		}

		if (current_top_question_id) {
			this.setQuestionStatus(current_top_question_id, new_status);
		}
		if (this.possible_top_question_id) {
			this.setQuestionStatus(this.possible_top_question_id, 'top');
			this.possible_top_question_id = null;
		}

		$(this.getEl('topQuestionConfirmation')).modal('hide');
	}
	editQuestion( question_id ) {
		for( let i = 0; i < this.state.mod_questions.length; i++ ) {
			if( this.state.mod_questions[i]._id != question_id ) {
				continue;
			}

			this.getEl('questionEditingTextarea').value = this.state.mod_questions[i].text;
			this.edit_question_id = question_id;

			$(this.getEl('questionEditingModal')).modal('show');
		}
	}
	acceptQuestion( question_id ) {
		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'question/edit/status',
			question_id: question_id,
			status: 'accepted'
		};

		this.primus.write(sendData);
	}
	rejectQuestion( question_id ) {
		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'question/edit/status',
			question_id: question_id,
			status: 'accepted'
		};

		this.primus.write(sendData);
	}
	sendQuestionEditingForm( event ) {
		event.preventDefault();

		let textArea = this.getEl('questionEditingTextarea');

		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'question/edit',
			question_id: this.edit_question_id,
			question_text: textArea.value,
		};

		this.primus.write(sendData);

		$(this.getEl('questionEditingModal')).modal('hide');

		this.edit_question_id = undefined;
		textArea.value = '';

		return false;
	}
    sortQuestions( qa, qb ) {
		// order: 'top', 'new', 'accepted', 'answered', 'rejected'
		// right now the sorting by status is not needed, it's done through filtering in template
		/*
		let qa_idx = this.status_order.indexOf(qa.status), qb_idx = this.status_order.indexOf(qb.status);

		// order: 'top', 'new', 'accepted', 'answered', 'rejected'
        if (qa_idx < qb_idx) return -1;
		if (qa_idx > qb_idx) return 1;
		*/

		// order by voters_count
		if (qa.voters_count > qb.voters_count) return -1;
		if (qa.voters_count < qb.voters_count) return 1;

        // order by time added (oldest on top)
        if (qa.added_time < qb.added_time) return -1;
        if (qa.added_time > qb.added_time) return 1;

        return 0;
    }
}