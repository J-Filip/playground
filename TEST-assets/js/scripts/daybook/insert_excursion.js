var excursionTypeHalf = $('excursion_type_half').get('value');

var checkRequired = function(excursionType) {
	if(excursionType === excursionTypeHalf) {
		$('date_to').erase('data-required');
		$('date_to_icon').addClass('hide');
	} else {
		$('date_to').set('data-required', 'true');
		$('date_to_icon').removeClass('hide');
	}
};


checkRequired($('excursion_type_id').get('value'));
$('excursion_type_id').addEvent('change', function(ev) { checkRequired(this.get('value')); });

var checkHalfDay = function(startDate, endDate) {
	if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		return true;
	}

	var excursionType = $('excursion_type_id').get('value');

	if(excursionType === excursionTypeHalf) {
		if(startDate.getTime() !== endDate.getTime()) {
			edAlert(_('Poludnevni izlet ima maksimalno trajanje od jednog dana!'));
			setTimeout(function() {
				$('datepicker_date_to').set('value','');
				$('date_to').set('value','');
				$('datepicker_date_from').blur();
				$('datepicker_date_to').blur();
			}, 300);

			return false;
		}
	}

	return true;
};

picker.addEvent('close', function(e) {
	var minDate = new Date($('date_from').get('value'));
	var maxDate = new Date($('date_to').get('value'));

	if(minDate > maxDate) {
		edAlert(_('Datum završetka ekskurzije mora biti nakon datuma početka. Molimo odaberite ispravan datum završetka!'));
		setTimeout(function() {
				$('datepicker_date_to').set('value','');
				$('date_to').set('value','');
				$('datepicker_date_from').blur();
				$('datepicker_date_to').blur();
			}, 300);
	}
});

$('insert-excursion').addEvent('submit', function(ev) {
	var minDate = new Date($('date_from').get('value'));
	var maxDate = new Date($('date_to').get('value'));

	if(!checkHalfDay(minDate, maxDate)) {
		ev.preventDefault();
		setTimeout(function() {
			$('submit_bttn').removeClass('hide');
		}, 200);
	}
});
