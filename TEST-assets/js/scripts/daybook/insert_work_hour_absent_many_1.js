var update_input = function() {
	var ids = '';

	$$('.selectable.selected').each(function (item, index)  {
		ids = ids+item.getProperty('data-work-hour-absent-id')+',';
	});
	$('work_hour_absent_id').value = ids;

	var selectable = $$('.selectable');
	var selected = $$('.selectable.selected');

	var sa_button = $('select-all');

	if(selected.length === selectable.length) {
		sa_button.addClass('selected');
		sa_button.set('text', _('Ukloni sve'));
		sa_button.set('data-select-status','1');
	} else {
		sa_button.removeClass('selected');
		sa_button.set('text', _('Odaberi sve'));
		sa_button.set('data-select-status','0');
	}
};

$$('#insert-absent .selectable').addEvent(default_event_type, function() {
	if(this.hasClass('selected')) {
		this.removeClass('selected');
	}
	else {
		this.addClass('selected');
	}
	update_input();
});

$('select-all').addEvent(default_event_type, function() {
	if(this.get('data-select-status') === '1') {
		$$('#insert-absent .selectable').removeClass('selected');
	} else {
		$$('#insert-absent .selectable').addClass('selected');
	}
	update_input();
});
