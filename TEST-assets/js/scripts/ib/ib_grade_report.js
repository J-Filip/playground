$('js-switch').addEvent(default_event_type, function(e) {
	$$('.grades').toggleClass('hide');
	if (e.target.innerHTML === _('Prvo polugodište')) {
		e.target.innerHTML = _('Kraj godine');
		$$('#dropdown-menu a').setProperty('href','/daybook/ib_grade_report_export/pdf')
	} else {
		e.target.innerHTML = _('Prvo polugodište');
		$$('#dropdown-menu a').setProperty('href','/daybook/ib_grade_report_export/pdf/true')
	}
});