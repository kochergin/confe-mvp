module.exports = class {
	onCreate() {
		this.state = {
			editing_speaker: {
				link: null,
				name: null,
				order_num: null,
				department: null,
				position: null,
				photo: null,
				biography: null,
                hidden: false,
			},
		};
	}
	onMount() {
		var $speakers = $(this.getEl('speakers'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=speakers-admin', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'speakers' ) {
				$speakers.collapse('hide');

				that.input.admin_speakers = data.speakers;

				setTimeout(function() {
					that.forceUpdate();
					$speakers.collapse('show');
				}, 350);
			}
		});
	}
	findSpeaker( speaker_link ) {
		for( let i = 0; i < this.input.admin_speakers.length; i++ ) {
			if( this.input.admin_speakers[i].link == speaker_link )
				return this.input.admin_speakers[i];
		}

		return undefined;
	}
	openAddNewSpeakerForm( event ) {
		event.preventDefault();

		this.getEl('editSpeakerFormTitle').textContent = 'Добавление нового докладчика';
		this.state.editing_speaker = {
			link: null,
			name: null,
			order_num: null,
			department: null,
			position: null,
			photo: null,
			biography: null,
            hidden: false,
		};
		$('#editSpeakerForm').modal('show');

		return false;
	}
	openEditSpeakerForm( speaker_link, event ) {
		event.preventDefault();
		
		let speaker = this.findSpeaker( speaker_link );

		if( speaker ) {
			this.getEl('editSpeakerFormTitle').textContent = 'Редактирования информации о докладчике';
			this.state.editing_speaker = speaker;
			$('#editSpeakerForm').modal('show');
		}

		return false;
	}
	editSpeakerPhotoChange( event ) {
		if( !event.target.files )
			return false;

		if( !event.target.files.length )
			return false;

		this.getEl('editSpeakerPhotoLabel').textContent = 'Выбран файл: '+event.target.files[0].name;
	}
	submitEditSpeakerForm( event ) {
		event.preventDefault();

		let formdata = new FormData(this.getEl('editSpeakerForm'));

		if( this.state.editing_speaker.link ) {
			formdata.append('link', this.state.editing_speaker.link);
		}

		let possible_photo = formdata.get('photo');

		// we won't even try to upload the file if it's empty
		if( possible_photo ) {
			if( !possible_photo.name || !possible_photo.size )
				formdata.delete('photo');
		}

		$.ajax({
			url: '/upload',
			data: formdata,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data) {
				if( data.message_type == 'error' ) {
					$('#editSpeakerErrorContent').text(data.text);
					$('#editSpeakerError').collapse('show');

					setTimeout(function() {
						$('#editSpeakerError').collapse('hide');
					}, 5000);
				} else {
					$('#editSpeakerForm').modal('hide');
				}
			}
		});

		return false;
	}
    showSpeaker( speaker_link, event ) {
        return this.toggleSpeaker( speaker_link, false, event );
    }
    hideSpeaker( speaker_link, event ) {
        return this.toggleSpeaker( speaker_link, true, event );
    }
	toggleSpeaker( speaker_link, speaker_hidden, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/speaker/toggle',
			speaker_link: speaker_link,
            speaker_hidden: speaker_hidden
		});

		return false;
	}
	deleteSpeaker( speaker_link, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/speaker/delete',
			speaker_link: speaker_link
		});

		return false;
	}
}