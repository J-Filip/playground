$$('#insert-grades .ocjena').addEvent(default_event_type, function (e) {
	$$('.ocjena').removeClass('selected');
	this.addClass('selected');
	$('grade_id').value = this.getProperty('data-grade-id');
});

if ($('date')) {
	var curr_date = $('datepicker_date').get('value');
	var curr_date_db = $('date').get('value');
	picker.close();
	picker.addEvent('close', function (e) {
		var date = new Date($('date').get('value'));
		var date_to = $('date_to').get('value');
		if (date_to != 'false') {
			date_to = new Date(date_to);
			if (date > date_to) {
				setTimeout(function () {
					edAlert(_('Greška - datum zapisa mora biti manji od Datuma do navedenog boravka učenika u bolnici'));
					$('date').set('value', curr_date_db);
					$('datepicker_date').set('value', curr_date);
					$('datepicker_date').blur();
				}, 300);
			}
		}
	});
}

if ($('insert-grades')) {
	$('insert-grades').addEvent('submit', function (e) {
		var error = false;
		//populated
		var grade = $('grade_id').get('value').trim().length > 0;
		var activity = $('activity').get('value').trim().length > 0;
		var note = $('note').get('value').trim().length > 0;
		var date = new Date($('date').get('value'));
		var date_hr = new $('datepicker_date').get('value');
		var date_to = $('date_to').get('value');
		if (date_to == 'false') {
			date_to = false;
		} else {
			date_to = new Date(date_to);
		}
		//msgs
		var msg = $('grade_id').get('data-msg');
		var activity_msg = $('activity').get('data-msg');
		var date_msg = $('date_to').get('data-msg');

		if (!grade && !note) {
			error = true;
		} else if (grade && !activity) {
			msg = activity_msg;
			error = true;
		} else if (date_to != false && date > date_to) {
			error = true;
			msg = date_msg + ' (' + date_hr + ')';
		}

		if (error) {
			e.preventDefault();
			setTimeout(function () {
				edAlert(msg);
				$('submit-grade').removeClass('hide');
			}, 300);
		}
	});
}