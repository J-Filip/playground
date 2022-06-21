$$('#teacher, #schoolyear_id').addEvent('change', function(ev) {
	var teacher_id = $('teacher').get('value');
	var scid = $('schoolyear_id').get('value');

	if(teacher_id != '' && scid != '') {
		wait = new edWait();
		wait.show();
		window.location = '/reports/work_hour_export/' + teacher_id + '/' + scid;
	}
});

$$('.next-button, .prev-button').addEvent('click', function(ev) {
	if(!this.hasClass('disabled')) {
		wait = new edWait();
		wait.show();
	}
});
