$('hide-notes').addEvent(default_event_type, function(e) {
	new DOMEvent(e).stop();
	$$('.notes').toggleClass('hide');
	if (e.target.innerHTML === _('Sakrij bilješke')) {
		e.target.innerHTML = _('Prikaži bilješke');
	} else {
		e.target.innerHTML = _('Sakrij bilješke');
	}
});
