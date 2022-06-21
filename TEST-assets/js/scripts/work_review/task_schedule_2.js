var tables = $$('.task_schedule');
tables.each(function(item) {
	new HtmlTable($(item.get('id')), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 2});
});

//privremeno oznacavanje duplikata, kad se sloze ogranicenja u  inputu mozemo maknuti
var cells = $$('.scheduled_date');
var previous = new Element('td');
var current;

cells.each(function(item,index) {
	if(!cells[index]) {
		return;
	}

	current = cells[index];
	if(current.get('text') === previous.get('text') && current.get('data-class-type-id') === previous.get('data-class-type-id')) {
		current.getParent().addClass('important-row');
		previous.getParent().addClass('important-row');
	}
	previous = current;
});

if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-class-type-id')).removeClass('hide');
	});
}

