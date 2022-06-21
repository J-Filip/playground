jquery('#user_id, #schoolyear_id').on('change', function(ev) {

	var userID = jquery('#user_id').val();
	var schoolyearID = jquery('#schoolyear_id').val();

	if(userID != '' && schoolyearID != '') {
		window.location = "/reports/teacher_timetable/" + userID + '/' + schoolyearID;
	}
});

var resizeTokens = function() {
	var selectedShiftID = $$('.cc-nav.active')[0].get('data-shift-id');

	var firstTableHeaderSize = $$('#' + selectedShiftID + ' th')[1].getSize();

	var height = firstTableHeaderSize.y;
	var width  = firstTableHeaderSize.x;
	
	var item_height = 0, parent, multiplier = 0;
	var shift_id, weekday_id, interval;
	var cell_order = 0;

	$$('.token').each(function(item, index) {
		shift_id = item.get('data-shift-id');
		weekday_id = item.get('data-weekday-id');
		interval = item.get('data-interval');

		if(shift_id != selectedShiftID) item.addClass('hide');

		multiplier = Math.ceil(item.get('data-duration')/15);
		
		item_height =  multiplier*height - 10;
		item_height = item_height > 40 ? item_height : 40;

		parent = $(shift_id + '-' + weekday_id + '-' + interval);
		position = parent.getPosition();
		cell_order = parent.getParent().get('data-cell-order');

		item.setStyles({ 'top' : position.y, 'left': position.x });
		item.setStyles({'width': (width - 10) + 'px'});
		item.setStyles({'height': item_height});
		item.setStyles({'z-index': cell_order});
	});
};

var switchShiftDisplay = function() {
	$$('li.token').addClass('hide');

	var shift_id = $$('.cc-nav.active')[0].get('data-shift-id');
	var elements = $$('li.token[data-shift-id="' + shift_id + '"]');

	elements.removeClass('hide');
}

window.addEvent('domready', function(ev) {
	$$('#sub-menu').setStyles({'z-index': 500});
	$$('#site-menu').setStyles({'z-index': 510});
	$$('#header').setStyles({'z-index': 520});

	resizeTokens();
});

window.addEvent('resize', function(ev) {
	resizeTokens();
});

if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-shift-id')).removeClass('hide');

		switchShiftDisplay();
		resizeTokens();
	});
}
