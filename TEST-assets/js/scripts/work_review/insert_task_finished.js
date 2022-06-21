picker.addEvent('close', function(e) {
	var minDate = new Date($('date_first').get('value'));
	var maxDate = new Date($('date_second').get('value'));
	if(minDate > maxDate) {
		setTimeout(function() {
		edAlert(_('Greška - datum ispravka mora biti nakon datuma izrade. Molimo odaberite ispravan datum izrade ili ispravka'));
			$('datepicker_date_second').set('value','');
			$('date_second').set('value','');
			$('datepicker_date_first').blur();
			$('datepicker_date_second').blur();
		}, 300);
	}
});
