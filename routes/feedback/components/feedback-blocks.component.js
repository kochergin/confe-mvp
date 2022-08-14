module.exports = class {
	onMount() {
		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=feedback', {
			// default
		});

        var that = this;

		this.primus.on('data', function message(data) {
			console.log('message from the server: ', data);

            if(data.message_type == 'give/feedback/success') {
                var submitBtn = that.getEl('feedbackFormSubmit'+data.block_id);
                submitBtn.classList.remove('btn-outline-secondary');
                submitBtn.classList.add('btn-outline-success');
                submitBtn.textContent = 'Сохранено!';

                setTimeout(function() {
                    submitBtn.classList.remove('btn-outline-success');
                    submitBtn.classList.add('btn-outline-primary');
                    submitBtn.textContent = 'Сохранить';
                    submitBtn.removeAttribute('disabled');
                }, 5000);
            }
		});

		console.log(this.input);
	}
	feedbackSendForm( block_id, event ) {
		event.preventDefault();
		var submitBtn = this.getEl('feedbackFormSubmit'+block_id);
		submitBtn.classList.remove('btn-outline-primary');
		submitBtn.classList.add('btn-outline-secondary');
		submitBtn.setAttribute('disabled', true);
		submitBtn.textContent = 'Отправка...';

		let formData = $(this.getEl('feedbackBlockForm'+block_id)).serializeArray();

		let sendData = {
			fingerprint: this.input.fingerprint,
			message_type: 'give/feedback',
			block_id: block_id,
			answers: []
		};
		formData.forEach(function(field) {
			if( field.name == 'block_id' )
				return;

			sendData.answers[parseInt(field.name.substring(1))] = field.value;
		});

		this.primus.write(sendData);

	}
}