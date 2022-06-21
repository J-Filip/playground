var tables = $$('.social_welfare');
tables.each(function(item) {
	new HtmlTable($(item.get('id')), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', 
		onSort: sorted, sortIndex: 2, classNoSort : 'no-sort'});
});

