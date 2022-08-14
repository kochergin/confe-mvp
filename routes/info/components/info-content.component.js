module.exports = class {
	onMount() {
		var $extraSchedule = $(this.getEl('extraSchedule'));
		var $flightInfo = $(this.getEl('flightInfo'));
		var $contactInfo = $(this.getEl('contactInfo'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=info', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'extra_schedule' ) {
				$extraSchedule.collapse('hide');

				that.input.extra_schedule = data.extra_schedule;

				setTimeout(function() {
					that.forceUpdate();
					$extraSchedule.collapse('show');
				}, 350);
			} else
			if( data.message_type == 'info/flights' ) {
				$flightInfo.collapse('hide');

				that.input.flights = data.flights;

				setTimeout(function() {
					that.forceUpdate();
					$flightInfo.collapse('show');
				}, 350);
			} else
			if( data.message_type == 'info/contacts' ) {
				$contactInfo.collapse('hide');

				that.input.contacts = data.contacts;

				setTimeout(function() {
					that.forceUpdate();
					$contactInfo.collapse('show');
				}, 350);
			}
		});
	}
}