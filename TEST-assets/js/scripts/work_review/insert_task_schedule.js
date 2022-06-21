$('datepicker_date').addEvent('change', function(){
	var input = $('datepicker_date').get('value');
	var date = input.split('.');
	var formatted = date[2].trim() + '-' + date[1].trim() + '-' + date[0].trim();
	var class_course_id = $('class_course_id').get('value');

	new Request.JSON({
			url: '/work_review/task_schedule_date_available/' + formatted + '/' + class_course_id,
			onSuccess: function (response) {
				if(response.notify === 1) {
					var msg = _('PAŽNJA!') + '<br />' + _('Unosite pisanu zadaću na datum:') + ' ' + input + '<br />';
					msg += _('Pisane zadaće zakazane isti dan:') + ' ' + response.today + '<br />';
					msg += _('Pisane zadaće zakazane u tjednu:') + ' ' + response.this_week;
					edAlert(msg);
				}
			}
		}).get();
});
