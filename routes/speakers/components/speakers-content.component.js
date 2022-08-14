module.exports = class {
    onCreate(input) {
        this.state = {
            speakers: input.speakers
        };
    }
	onMount() {
		var $speakers = $(this.getEl('speakers'));
		var that = this;

		that.showSpeakersBio();

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=speakers', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'speakers' ) {
				$speakers.collapse('hide');

				that.state.speakers = data.speakers;

                that.setStateDirty("speakers");

                that.once('update', function() {
                    setTimeout(function() {
                        $speakers.collapse('show');
                        that.showSpeakersBio();
                    }, 350);
                });
			}
		});
	}
    showSpeakersBio() {
        var $selected_speaker;
        if( location.hash ) {
            $selected_speaker = $('#bio-'+location.hash.substring(1));
            if( $selected_speaker )
                $selected_speaker.collapse('show')
        }
    }
}