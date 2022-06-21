var table = new HtmlTable($('grades'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 5});
var table = new HtmlTable($('final-grades'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 5});

if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-log-type-id')).removeClass('hide');

		$$('.log-legend').addClass('hide');
		$('legend-' + this.get('data-log-type-id')).removeClass('hide');

		$$('.log-count').addClass('hide');
		$('total-' + this.get('data-log-type-id')).removeClass('hide');
	});
}
