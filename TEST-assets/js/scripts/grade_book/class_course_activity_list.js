if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.cc-container').addClass('hide');
		$(this.get('data-class-type-id')).removeClass('hide');
	});
}
