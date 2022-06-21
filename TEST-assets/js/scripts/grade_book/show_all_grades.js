var button = jquery('a.button2[href$="pdf"]')[0];
jquery(button).attr('data-hide-notes', false);

$('hide-notes').addEvent(default_event_type, function (e) {
	new DOMEvent(e).stop();
	$$('.notes').toggleClass('hide');
	if (e.target.innerHTML === _('Sakrij bilješke')) {
		e.target.innerHTML = _('Prikaži bilješke');
	} else {
		e.target.innerHTML = _('Sakrij bilješke');
	}

	if($$('.notes')[0].hasClass('hide')) {
		jquery(button).attr('data-hide-notes', true);
	}
	else {
		jquery(button).attr('data-hide-notes', false);
	}
});


jquery(button).on('click', function(ev) {
	ev.preventDefault();

	var href = jquery(ev.target).attr('href');
	var hide = jquery(ev.target).attr('data-hide-notes') === 'true';
	
	if(hide) {
		href += '/hide';
	}

	window.location = href;
});