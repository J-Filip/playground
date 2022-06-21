$('submit').addEvent(default_event_type, function(ev) {
	var value = $('overall_score').get('value');
	var grade = parseFloat(value.replace(',','.'));
	var match = value.match(/^(0+)?[1-5](\.?\,?\d{1,2})?$/);

	if(grade > 5 || !match) {
		new DOMEvent(ev).stop();
		edAlert(_('Ocjena nije ispravnog formata!'));
		$('overall_score').addClass('validation-error');
	}
});
