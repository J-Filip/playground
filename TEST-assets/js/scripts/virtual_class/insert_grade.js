$$('#insert-grades .ocjena').addEvent(default_event_type, function (e) {
		$$('.ocjena').removeClass('selected');
		this.addClass('selected');
		$('grade_id').value=this.getProperty('data-grade-id');
});

$$('.checkbutton').addEvent(default_event_type, function(){
	$$('.checkbutton').addClass('unchecked');
	this.removeClass('unchecked');

	switch(this.get('id')) {
		case 'true': $('important').set('value','true');
					break;
		case 'false': $('important').set('value','false');
					break;
		default:	break;
	}
});

picker.addEvent('close', function(ev) {
	var grade_date = $('grade_date');

	if(grade_date) {
		var date = new Date().parse(grade_date.get('value'));

		if(date.getDay() === 0) {
			setTimeout(function() {
				edAlert(_('Nije moguće unijeti ocjenu na nenastavni dan!'));
				$('datepicker_grade_date').set('value', new Date().format('%d. %m. %Y.'));
			}, 200);
		}
	}
});
