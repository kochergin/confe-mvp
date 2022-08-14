module.exports = class {
	onCreate() {
		this.state = {
			editing_flight: {
				_id: null,
				date_formatted: null,
				date_input_formatted: null,
				checkout_time_formatted: null,
				transfer_time_formatted: null,
				flight_time_formatted: null,
			},
			editing_contact: {
				_id: null,
				order_num: null,
				name: null,
				phone_number: null,
			}
		}
	}
	onMount() {
		var $flightInfo = $(this.getEl('flightInfo'));
		var $contactInfo = $(this.getEl('contactInfo'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=info', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'info/flights' ) {
				$flightInfo.collapse('hide');

				that.input.admin_flights = data.flights;

				setTimeout(function() {
					that.forceUpdate();
					$flightInfo.collapse('show');
				}, 350);
			} else
			if( data.message_type == 'info/contacts' ) {
				$contactInfo.collapse('hide');

				that.input.admin_contacts = data.contacts;

				setTimeout(function() {
					that.forceUpdate();
					$contactInfo.collapse('show');
				}, 350);
			}
		});
	}
	findFlight( flight_id ) {
		for( let i = 0; i < this.input.admin_flights.length; i++ ) {
			if( this.input.admin_flights[i]._id == flight_id ) {
				return this.input.admin_flights[i];
			}
		}

		return undefined;
	}
	findContact( contact_id ) {
		for( let i = 0; i < this.input.admin_contacts.length; i++ ) {
			if( this.input.admin_contacts[i]._id == contact_id ) {
				return this.input.admin_contacts[i];
			}
		}

		return undefined;
	}
	openAddNewFlightForm( event ) {
		event.preventDefault();

		this.getEl('editFlightFormTitle').textContent = 'Добавление нового рейса';
		this.state.editing_flight = {
			flight_id: null,
			date: null,
			date_formatted: null,
			checkout_time_formatted: null,
			transfer_time_formatted: null,
			flight_time_formatted: null,
		};
		$('#editFlightForm').modal('show');

		return false;
	}
	openEditFlightForm( flight_id, event ) {
		event.preventDefault();

		let flight = this.findFlight( flight_id );

		if( flight ) {
			this.getEl('editFlightFormTitle').textContent = 'Редактирования информации о рейсе';
			this.state.editing_flight = flight;
			$('#editFlightForm').modal('show');
		}

		return false;
	}
	submitEditFlightForm( event ) {
		event.preventDefault();

		let flight = {
			flight_number: this.getEl('editFlightNumberField').value,
			date_input_formatted: this.getEl('editFlightDateField').value,
			checkout_time_formatted: this.getEl('editFlightCheckoutField').value,
			transfer_time_formatted: this.getEl('editFlightTransferField').value,
			flight_time_formatted: this.getEl('editFlightTimeField').value,
		};

		if( this.state.editing_flight._id ) {
			// editing
			flight._id = this.state.editing_flight._id;

			this.primus.write({
				fingerprint: this.input.fingerprint,
				message_type: 'admin/info/flight/edit',
				flight: flight
			});
		} else {
			// creating new
			this.primus.write({
				fingerprint: this.input.fingerprint,
				message_type: 'admin/info/flight/new',
				flight: flight
			});
		}

		$('#editFlightForm').modal('hide');

		return false;
	}
	deleteFlight( flight_id, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/info/flight/delete',
			flight_id: flight_id
		});

		return false;
	}
	openAddNewContactForm( event ) {
		event.preventDefault();

		this.getEl('editContactFormTitle').textContent = 'Добавление нового контакта';
		this.state.editing_contact = {
			contact_id: null,
			order_num: null,
			name: null,
			phone_number: null,
		};
		$('#editContactForm').modal('show');

		return false;
	}
	openEditContactForm( contact_id, event ) {
		event.preventDefault();
		
		let contact = this.findContact( contact_id );

		if( contact ) {
			this.getEl('editContactFormTitle').textContent = 'Редактирования контакта';
			this.state.editing_contact = contact;
			$('#editContactForm').modal('show');
		}

		return false;
	}
	submitEditContactForm( event ) {
		event.preventDefault();

		let contact = {
			order_num: parseInt(this.getEl('editContactNumberField').value, 10),
			name: this.getEl('editContactNameField').value,
			phone_number: this.getEl('editContactPhoneNumberField').value,
		};

		if( this.state.editing_contact._id ) {
			contact._id = this.state.editing_contact._id;

			this.primus.write({
				fingerprint: this.input.fingerprint,
				message_type: 'admin/info/contact/edit',
				contact: contact
			});
		} else {
			this.primus.write({
				fingerprint: this.input.fingerprint,
				message_type: 'admin/info/contact/new',
				contact: contact
			});
		}

		$('#editContactForm').modal('hide');

		return false;
	}
	deleteContact( contact_id, event ) {
		event.preventDefault();

		this.primus.write({
			fingerprint: this.input.fingerprint,
			message_type: 'admin/info/contact/delete',
			contact_id: contact_id
		});

		return false;
	}
}