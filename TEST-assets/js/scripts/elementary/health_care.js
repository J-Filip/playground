if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.rounded-bgr').addClass('hide');
		$(this.get('data-id')).removeClass('hide');
	});
}
