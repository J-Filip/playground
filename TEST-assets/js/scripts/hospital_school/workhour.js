$$('.checkbutton').addEvent('click', function (e) {
	if (this.hasClass('unchecked')) {
		$$('.checkbutton').addClass('unchecked');
		this.removeClass('unchecked');
		$('duration').set('value', this.get('data-value'));
	}
});

$('reset').addEvent('click', function () {
	var def = $('duration').get('data-default');
	$('duration').set('value', def);
	$$('.checkbutton').addClass('unchecked');
	$$('.default').removeClass('unchecked');
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

if ($('add_hospital_student_workhour_action')) {
	$('add_hospital_student_workhour_action').addEvent('submit', function (e) {
		var error = false;

		var note = $('note').get('value').trim().length > 0;
		var msg = $('note').get('data-msg');
		var date = new Date($('date').get('value'));
		var date_hr = new $('datepicker_date').get('value');
		var date_to = $('date_to').get('value');
		if (date_to == 'false') {
			date_to = false;
		} else {
			date_to = new Date(date_to);
		}
		var date_msg = $('date_to').get('data-msg');
		
		if (!note) {
			error = true;
		} else if (date_to != false && date > date_to) {
			msg = date_msg + ' (' + date_hr + ')';
			error = true;
		}

		if (error) {
			e.preventDefault();
			setTimeout(function () {
				edAlert(msg);
				$('submit-workhour').removeClass('hide');
			}, 300);
		}
	}
	);
}