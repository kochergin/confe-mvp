module.exports = class {
	onMount() {
		var $mainSchedule = $(this.getEl('mainSchedule'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=schedule', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'schedule' ) {
				$mainSchedule.removeClass('show');

				that.input.schedule = data.schedule;

				setTimeout(function() {
					that.forceUpdate();
					$mainSchedule.addClass('show');
				}, 250);
			}
		});
	}
}