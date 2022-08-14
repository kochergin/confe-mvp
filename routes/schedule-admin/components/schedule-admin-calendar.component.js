module.exports = class {
	onCreate(input) {
		this.state = {
			editing_session: {
				date_input_formatted: null,
				title: null,
				location: null,
				show_title: null,
				extra_session: null,
			},
			editing_event: {
				title: null,
				type: {
                    _id: null,
                    name: null,
                    classes: null,
                },
				start_time_formatted: null,
				end_time_formatted: null,
				speaker_name: null,
				speaker_link: null,
				location: null,
				questions_allowed: null,
				ratings_allowed: null,
			},
			editing_event_session_id: null,
			editing_event_date: null,
			editing_event_date_formatted: null,
			current_sessions: [],
			current_speakers: input.speakers,
            admin_schedule: input.admin_schedule,
		};
	}
	onMount() {
		var $adminSchedule = $(this.getEl('adminSchedule'));
		var $editSessionError = $(this.getEl('editSessionError'));
		var $editEventError = $(this.getEl('editEventError'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=schedule-admin', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'admin/schedule' ) {
				$adminSchedule.removeClass('show');

                that.state.admin_schedule = data.admin_schedule;

                that.setStateDirty("admin_schedule");
                that.once('update', function() {
                    setTimeout(function() {
                        $adminSchedule.addClass('show');
                    }, 250);
                });
			} else
			if( data.message_type == 'speakers' ) {
				$adminSchedule.removeClass('show');

				that.state.current_speakers = data.speakers;

				that.setStateDirty("current_speakers");
                that.once('update', function() {
                    setTimeout(function() {
                        $adminSchedule.addClass('show');
                    }, 250);
                });
			} else
			if( data.message_type == 'admin/session/new/success' || data.message_type == 'admin/session/edit/success' ) {
				$('#editSessionForm').modal('hide');
			} else
			if( data.message_type == 'admin/session/new/error' || data.message_type == 'admin/session/edit/error' ) {
				$editSessionError.collapse('show');
				setTimeout(function() {
					$editSessionError.collapse('hide');
				}, 10000);
			} else
			if( data.message_type == 'admin/event/new/success' || data.message_type == 'admin/event/edit/success' ) {
				that.state.editing_event_session_id = null;
				that.state.editing_event_date = null;
				that.state.editing_event_date_formatted = null;
				$('#editEventForm').modal('hide');
			} else
			if( data.message_type == 'admin/event/new/error' || data.message_type == 'admin/event/edit/error' ) {
				$editEventError.collapse('show');
				setTimeout(function() {
					$editEventError.collapse('hide');
				}, 10000);
			}
		});
	}
	findEventType( event_type_id ) {
		for( let i = 0; i < this.input.event_types.length; i++ ) {
			if( this.input.event_types[i]._id == event_type_id ) {
				return this.input.event_types[i];
			}
		}

		return this.input.event_types[0];
	}
	findDay( day_id ) {
		for( let i = 0; i < this.state.admin_schedule.length; i++ ) {
			if( this.state.admin_schedule[i]._id == day_id ) {
				return this.state.admin_schedule[i];
			}
		}

		return undefined;
	}
	findSession( session_id ) {
		for( let i = 0; i < this.state.admin_schedule.length; i++ ) {
			for( let j = 0; j < this.state.admin_schedule[i].sessions.length; j++ ) {
				if( this.state.admin_schedule[i].sessions[j]._id == session_id ) {
					return this.state.admin_schedule[i].sessions[j];
				}
			}
		}

		return undefined;
	}
	findEvent( event_id ) {
		for( let i = 0; i < this.state.admin_schedule.length; i++ ) {
			for( let j = 0; j < this.state.admin_schedule[i].sessions.length; j++ ) {
				for( let k = 0; k < this.state.admin_schedule[i].sessions[j].events.length; k++ ) {
					if( this.state.admin_schedule[i].sessions[j].events[k]._id == event_id ) {
						return this.state.admin_schedule[i].sessions[j].events[k];
					}
				}
			}
		}

		return undefined;
	}
    findSpeaker( speaker_link ) {
		for( let i = 0; i < this.state.current_speakers.length; i++ ) {
			if( this.state.current_speakers[i].link == speaker_link ) {
				return this.state.current_speakers[i];
			}
		}
    }
	/*openAddDayForm( event ) {
		event.preventDefault();

		this.state.selected_day_id = null;
		this.getEl('editDayFormTitle').textContent = 'Добавление нового дня';
		this.getEl('editDayDateField').value = moment().locale('ru').format('YYYY-MM-DD');
		$('#editDayForm').modal('show');
	}
	openEditDayForm( day_id, event ) {
		event.preventDefault();

		let day = this.findDay( day_id );
		if( day ) {
			this.state.selected_day_id = day_id;
			this.getEl('editDayFormTitle').textContent = 'Редактирование дня';
			console.log(moment.unix(day.date).format('YYYY-MM-DD'));
			this.getEl('editDayDateField').value = moment.unix(day.date).format('YYYY-MM-DD');
			$('#editDayForm').modal('show');
		}
	}
	submitEditDayForm( event ) {
		event.preventDefault();

		if( this.state.selected_day_id !== null ) {
			// editing a day
			console.log('editing day #'+this.state.selected_day_id);
			this.primus.write({
				fingerprint: this.input.fingerprint,
				message_type: 'admin/day/edit',
				day: {
					day_id: this.state.selected_day_id,
					date: moment(this.getEl('editDayDateField').value, 'YYYY-MM-DD').unix(),
				},
			});
		} else {
			// new day
			console.log('new day');
			this.primus.write({
				fingerprint: this.input.fingerprint,
				message_type: 'admin/day/new',
				day: {
					day_id: null,
					date: moment(this.getEl('editDayDateField').value, 'YYYY-MM-DD').unix(),
				},
			});
		}

		this.state.selected_day_id = null;
		$('#editDayForm').modal('hide');

		return false;
	}*/
	openAddSessionForm( day_id, event ) {
		event.preventDefault();

		this.state.editing_session = {
			date_input_formatted: null,
			title: null,
			location: null,
			show_title: true,
			extra_session: false,
		};

		if( day_id ) {
			let day = this.findDay( day_id );

			if( day ) {
				this.state.editing_session.date_input_formatted = day.date_input_formatted;
			}
		}

		this.getEl('editSessionFormTitle').textContent = 'Добавление новой сессии';
		$('#editSessionForm').modal('show');
	}
	openEditSessionForm( session_id, event ) {
		event.preventDefault();

		let session = this.findSession( session_id );

		if( session ) {
			this.state.editing_session = session;
			//this.state.editing_session.date_input_formatted = moment.unix(session.date).format('YYYY-MM-DD');
			this.getEl('editSessionFormTitle').textContent = 'Редактирование сессии';
			$('#editSessionForm').modal('show');
		}
	}
	submitEditSessionForm( event ) {
		event.preventDefault();

		let selectBox = this.getEl('editSessionDateSelect');

		let new_session_data = {
			fingerprint: this.input.fingerprint,
			message_type: 'admin/session/new',
			session: {
				num: 0,
				date_input_formatted: this.getEl('editSessionDateField').value,
				title: this.getEl('editSessionTitleField').value,
				location: this.getEl('editSessionLocationField').value,
				show_title: this.getEl('editSessionShowTitleCheckbox').checked,
				extra_session: this.getEl('editSessionExtraCheckbox').checked,
			},
		};

		if( this.state.editing_session._id ) {
			new_session_data.message_type = 'admin/session/edit';
			new_session_data.session._id = this.state.editing_session._id;
		} else {
			new_session_data.message_type = 'admin/session/new';
		}

		this.primus.write(new_session_data);

		return false;
	}
	openAddEventForm( day_id, session_id, event ) {
		event.preventDefault();

		let day = this.findDay( day_id );
		let session = this.findSession( session_id );

		if( day && session ) {
			this.getEl('editEventFormTitle').textContent = 'Добавление нового события';

			this.state.editing_event = {
				title: null,
				type: this.findEventType(),
				start_time_formatted: null,
				end_time_formatted: null,
				speaker_name: null,
				speaker_link: null,
				location: null,
				questions_allowed: !session.extra_session,
				ratings_allowed: !session.extra_session,
			};
			this.state.current_sessions = day.sessions;
			this.state.editing_event_session_id = session._id;
			this.state.editing_event_date = day.date;
			this.state.editing_event_date_formatted = day.date_formatted;

			// custom speaker field hidden by default
			$('#editEventCustomSpeaker').removeClass('show');

			// need location field for extra events:
			if( session.extra_session ) {
				$('#editEventSpeaker').removeClass('show');
				$('#editEventLocation').addClass('show');
			} else {
				$('#editEventSpeaker').addClass('show');
				$('#editEventLocation').removeClass('show');
			}

			$('#editEventForm').modal('show');
		}

		return false;
	}
	openEditEventForm( day_id, session_id, event_id ) {
		event.preventDefault();

		let day = this.findDay( day_id );
		let session = this.findSession( session_id );
		let ev = this.findEvent( event_id );

		if( day && session && ev ) {
			this.getEl('editEventFormTitle').textContent = 'Редактирования события';

			this.state.editing_event = ev;
			this.state.current_sessions = day.sessions;
			this.state.editing_event_session_id = session._id;
			this.state.editing_event_date = day.date;
			this.state.editing_event_date_formatted = day.date_formatted;

			// only location for extra events
			if( session.extra_session ) {
				$('#editEventLocation').addClass('show');
				$('#editEventSpeaker').removeClass('show');
				$('#editEventCustomSpeaker').removeClass('show');
			} else {
				$('#editEventLocation').removeClass('show');
				$('#editEventSpeaker').addClass('show');

				// no speaker: no name, no link (no custom field)
				// custom speaker: only name
				// planned speaker: name and link (no custom field)
				if( ev.speaker_name && !ev.speaker_link ) {
					$('#editEventCustomSpeaker').collapse('show');
				} else {
					$('#editEventCustomSpeaker').collapse('hide');
				}
			}

			$('#editEventForm').modal('show');
		}

		return false;
	}
	editEventDateChange( event ) {
		let dateSelectbox = this.getEl('editEventDateSelectbox');
		let day = this.findDay( dateSelectbox.options[dateSelectbox.selectedIndex].value );

		if( !day )
			return false;

		this.state.current_sessions = day.sessions;
	}
	editEventSessionChange( event ) {
		let sessionSelectbox = this.getEl('editEventSessionSelectbox');
		let session = this.findSession( sessionSelectbox.options[sessionSelectbox.selectedIndex].value );

		if( !session )
			return false;
		
		if( session.extra_session ) {
			$('#editEventLocation').collapse('show');
			$('#editEventSpeaker').collapse('hide');
		} else {
			$('#editEventLocation').collapse('hide');
			$('#editEventSpeaker').collapse('show');
		}
	}
	editEventSpeakerChange( event ) {
		let selectBox = this.getEl('editEventSpeakerSelectbox');
		if( selectBox.options[selectBox.selectedIndex].value == 'custom-speaker' ) {
			$('#editEventCustomSpeaker').collapse('show');
		} else {
			$('#editEventCustomSpeaker').collapse('hide');
		}
	}
	submitEditEventForm( event ) {
		event.preventDefault();

		let sessionSelectbox = this.getEl('editEventSessionSelectbox');
		let session = this.findSession( sessionSelectbox.options[sessionSelectbox.selectedIndex].value );

		if( !session )
			return false;

		let new_event_data = {
			fingerprint: this.input.fingerprint,
			session_id: session._id,
			event: {
				title: this.getEl('editEventTitleField').value,
				type: this.findEventType(this.getEl('editEventTypeSelectbox').value),
				start_time_formatted: this.getEl('editEventStartTimeField').value,
				end_time_formatted: this.getEl('editEventEndTimeField').value,
				questions_allowed: this.getEl('editEventQuestionsCheckbox').checked,
				ratings_allowed: this.getEl('editEventRatingsCheckbox').checked,
			},
		};

		if( session.extra_session ) {
			new_event_data.event.location = this.getEl('editEventLocationField').value;
		} else {
			let speakerSelectbox = this.getEl('editEventSpeakerSelectbox');
			let speaker_name; // TODO: redo
			let speaker_link = speakerSelectbox.options[speakerSelectbox.selectedIndex].value;
            let speaker_hidden = false;

			if( speaker_link === 'custom-speaker' ) { // speaker without a profile
				speaker_link = undefined;
				speaker_name = this.getEl('editEventCustomSpeakerField').value;
                speaker_hidden = false;
			} else if (speaker_link == '') { // event without a speaker
				speaker_name = undefined;
                speaker_hidden = false;
			} else { // speaker with a profile
                let speaker_data = this.findSpeaker(speaker_link);
                speaker_name = speaker_data.name;
                speaker_hidden = speaker_data.hidden;
            }

			new_event_data.event.speaker_name = speaker_name;
			new_event_data.event.speaker_link = speaker_link;
            new_event_data.event.speaker_hidden = speaker_hidden;
		}

		if( this.state.editing_event._id ) {
			new_event_data.event._id = this.state.editing_event._id;

			// editing an event
			console.log('editing event #'+new_event_data.event._id);
			new_event_data.message_type = 'admin/event/edit';

			this.primus.write(new_event_data);
		} else {
			// new event for the session
			console.log('new event for the session #'+new_event_data.session_id);
			new_event_data.message_type = 'admin/event/new';
			this.primus.write(new_event_data);
		}

		return false;
	}
	deleteDay( day_id, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/day/delete',
			day_id: day_id
		});

		return false;
	}
	deleteSession( session_id, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/session/delete',
			session_id: session_id
		});

		return false;
	}
	deleteEvent( event_id, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/event/delete',
			event_id: event_id
		});

		return false;
	}
}