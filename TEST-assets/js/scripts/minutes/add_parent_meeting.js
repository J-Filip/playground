$('datepicker_date').addEvent('change',function() {
	var date = new Date().parse($('datepicker_date').get('value'));

	new Request.JSON({
		url: '/minutes/parent_meeting_date_available/' + date.format('%Y-%m-%d'),
		onSuccess: function (response) {
			if(!response.available) {
				var msg = _('Nije moguće zakazati roditeljski sastanak na datum:') + ' ' + date.format('%d.%m.%Y.') + '\n';
				msg += _('Termin je već iskorišten');
				edAlert(msg);
				$('submit').set('disabled','disabled');
				$('submit').addClass('op30');
			} else {
				$('submit').erase('disabled');
				$('submit').removeClass('op30');
			}
		}
	}).get();
});
