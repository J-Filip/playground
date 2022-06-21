jquery('.class_course').edEditMenu('#group1');
jquery('.teacher').edEditMenu('#group2');

new edConfirm('.delete-course', _('Želite li obrisati predmet') + ' confirm-msg?');
new edConfirm('.delete-teacher', _('Želite li obrisati nastavnika') + ' confirm-msg?');

if($$('.cc-nav')) {
		$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-class-type-id')).removeClass('hide');
	});
}