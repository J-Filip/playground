if($$('.cc-nav')) {
		$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		var data = this.get('data-class-type-id');
		$$('.log-table[data-id="'+data+'"]').removeClass('hide');
	});
}
