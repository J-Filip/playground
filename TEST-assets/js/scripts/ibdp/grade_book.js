new edConfirm('.student-final-grade-delete', _('Želite li obrisati zaključnu ocjenu?'));
new edConfirm('.student-grade-delete', _('Želite li obrisati confirm-msg?'));
new edConfirm('.loa-delete', _('Želite li obrisati ocjenu?'));

/* Rotate table headers */
window.addEvent('domready', function(){
    $$('#tbl-ocjene th.rotate').rotateHeaders();
});

jquery('.grade-edit').edEditMenu('#group1');
jquery('.sfg-admin').edEditMenu('#group2');
jquery('.loa').edEditMenu('#group3');

edLayout.addTouchFeedback($$('.grade-row'));

$$('.grade-row').addEvent(default_event_type, function(e) {
	var id = this.get('data-grade-select');
	var el = $(id);

	if(el) {
		if(!edLayout.preventEvent) {
			if(!this.hasClass('grade-activated')) {
				$$('.grade-activated').removeClass('grade-activated'); 
				el.addClass('grade-activated');
				this.addClass('grade-activated');
			} else {
				this.removeClass('grade-activated');
				el.removeClass('grade-activated');
			}
		}
	} else {
		$$('.grade-activated').removeClass('grade-activated'); 
	}
});

if(!Browser.isMobile) {
	$$('.grade-row').addEvent('mouseover', function(ev) {
		ev.stop();

		var id = this.get('data-grade-select');
		var el = $(id);

		$$('.grade-selected').removeClass('grade-selected');

		if(el) {
			this.addClass('grade-selected');
			el.addClass('grade-selected');
		}
	});

	$('content').addEvent('mouseover', function(e) {
		$$('.grade-selected').removeClass('grade-selected');
	});
}