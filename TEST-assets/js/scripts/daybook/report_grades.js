$('hide-notes').addEvent(default_event_type, function (e) {
	new DOMEvent(e).stop();

	$$('.notes').toggleClass('hide');

	if (e.target.innerHTML === _('Sakrij bilješke')) {
		e.target.innerHTML = _('Prikaži bilješke');
		$$('#dropdown-menu li a').setProperty('href','/daybook/all_students_grades_report_export/pdf/true');
	} else {
		e.target.innerHTML = _('Sakrij bilješke');
		$$('#dropdown-menu li a').setProperty('href','/daybook/all_students_grades_report_export/pdf');
	}

});
