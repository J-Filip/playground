picker.addEvent('close', function(e) {
	var minDate = new Date($('date_from').get('value'));
	var maxDate = new Date($('date_to').get('value'));
	if(minDate > maxDate) {
		setTimeout(function() {
		edAlert(_('Greška - datum završetka mora biti nakon datuma početka. Molimo odaberite ispravan datum početka ili završetka'));
			$('datepicker_date_to').set('value','');
			$('date_to').set('value','');
			$('datepicker_date_from').blur();
			$('datepicker_date_to').blur();
		}, 300);
	}
});
