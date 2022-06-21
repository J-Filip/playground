$$('.hospital-grades').each(function (elem, index) {
	new HtmlTable(elem, {
		sortable: true,
		classHeadSort: 'sort-asc',
		classHeadSortRev: 'sort-desc',
		onSort: sorted,
		sortIndex: 3,
		sortReverse: true
	});
});
$$('.hospital-workhour').each(function (elem, index) {
	new HtmlTable(elem, {
		sortable: true,
		classHeadSort: 'sort-asc',
		classHeadSortRev: 'sort-desc',
		onSort: sorted,
		sortIndex: 0
	});
});
