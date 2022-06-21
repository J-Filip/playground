var absentNotExcused = 2980;
var absentOther = 3990;

$('excused').addEvent('change', function (ev) {
	var absentType = $('work_hour_absent_type_id');

	if (this.value == absentNotExcused) {
		absentType.value = absentOther;
	}
	else {
		absentType.value = "";
	}
	absentType.fireEvent('change');
});

$('work_hour_absent_type_id').addEvent('change', function (event) {
	var reason = $('reason');

	if (this.value == absentOther) {
		var icon = new Element('i', { 'id': 'reason_required_icon', 'class': 'icon-asterisk required' });
		icon.inject($('reason_label'));
		reason.setProperty('data-required', true);
	}
	else {
		reason.removeProperty('data-required');
		var icon = $('reason_required_icon');
		if (icon) icon.destroy();
	}
});