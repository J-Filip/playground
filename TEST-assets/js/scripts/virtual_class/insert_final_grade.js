$$('#insert-grades .ocjena').addEvent(default_event_type, function (e) {
	$$('.ocjena').removeClass('selected');
	this.addClass('selected');
	$('grade_id').value=this.getProperty('data-grade-id');
});
