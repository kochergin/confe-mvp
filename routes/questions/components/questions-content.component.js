function timeToHHMM( time ) {
	return ('00'+Math.floor(time/3600)%24).slice(-2)+':'+('00'+Math.floor((time%3600)/60)).slice(-2);
}

function timeToMM( time ) {
	return Math.floor(time/60);
}

module.exports = class {
    onCreate(input) {
        this.state = {
            current_questions: input.current_questions || [],
        };
        this.status_order = ['top', 'new', 'accepted', 'answered', 'rejected'];
    }
	onMount() {
		var $questions = $(this.getEl('questions'));
		var that = this;

        // the data this page receives is the same as "now" page, so we subscribe to the same "channel"
		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=now', {
			// default settings
		});

		this.primus.on('open', function(opts) {
			that.online = true;
		});

		this.primus.on('reconnect scheduled', function(opts) {
			that.online = false;
		});

		this.primus.on('reconnected', function(opts) {
            // request updated data

			that.online = true;
			this.write({
				fingerprint: that.input.fingerprint,
				message_type: 'current_event'
			});
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'current_event' ) {
                $questions.removeClass('show');

                that.state.current_questions = data.current_questions || [];

                that.setStateDirty("current_questions");

                that.once('update', function() {
                    setTimeout(function() {
                        $questions.addClass('show');
                    }, 350);
                });
			}
			if( data.message_type == 'no_current_event' ) {
				$questions.removeClass('show');

                that.setStateDirty("current_questions");

                that.once('update', function() {
                    setTimeout(function() {
                        $questions.addClass('show');
                    }, 350);
                });
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
                    let i = 0, question_found = false;
                    while( i < that.state.current_questions.length ) {
                        if( that.state.current_questions[i]._id == data.question_id ) {
                            question_found = true;
                            break;
                        } else {
                            i++;
                        }
                    }

                    if(question_found) {
                        $questions.removeClass('show');

                        that.state.current_questions.splice(i, 1);
                        that.setStateDirty("current_questions");

                        setTimeout(function() {
                            $questions.addClass('show');
                        }, 200);
                    }
                }
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
}