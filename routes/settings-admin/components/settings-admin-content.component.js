module.exports = class {
	onCreate() {
		this.state = {
			editing_settings: {
				header: null,
				home_header: null,
				home_description: null,
				footer_enable: null,
                footer_text: null,
                timezone: null,
			}
		}
	}
	onMount() {
		var $siteSettings = $(this.getEl('siteSettings'));
		var that = this;

		this.primus = Primus.connect('/primus?fingerprint='+this.input.fingerprint+'&page=settings-admin', {
			// default settings
		});

		this.primus.on('data', function(data) {
			console.log('message received: ', data);

			if( data.message_type == 'admin/settings/edit' ) {
				$siteSettings.collapse('hide');

				that.input.site_settings = data.site_settings;

				setTimeout(function() {
					that.forceUpdate();
					$siteSettings.collapse('show');
				}, 350);
			}
		});
	}
	submitEditSiteSettingsForm( event ) {
		event.preventDefault();

		let timezoneSelectbox = this.getEl('editSiteSettingsTimezoneSelectbox');

		let new_site_settings = {
            header: this.getEl('editSiteSettingsHeaderField').value,
            home_header: this.getEl('editSiteSettingsHomeHeaderField').value,
            home_description: this.getEl('editSiteSettingsHomeDescriptionField').value,
            footer_enable: !!this.getEl('editSiteSettingsFooterCheckbox').checked,
            footer_text: this.getEl('editSiteFooterField').value,
            timezone: timezoneSelectbox.options[timezoneSelectbox.selectedIndex].value,
		};

        this.primus.write({
            fingerprint: this.input.fingerprint,
            message_type: 'admin/settings/edit',
            site_settings: new_site_settings
        });

		return false;
	}
}