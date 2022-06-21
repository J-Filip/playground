var table = new HtmlTable($('hospital_workhour'), {
	sortable: true,
	classHeadSort: 'sort-asc',
	classHeadSortRev: 'sort-desc',
	onSort: sorted,
	sortIndex: 0
});

jquery('.edit-field').edEditMenu('#group1');

if ($('workhour-delete')) {
	new edConfirm('#workhour-delete', _('Želite li obrisati unos') + '?');
}