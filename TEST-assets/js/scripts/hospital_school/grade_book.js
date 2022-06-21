var table = new HtmlTable($('hospital_grades'), {
	sortable: true,
	classHeadSort: 'sort-asc',
	classHeadSortRev: 'sort-desc',
	onSort: sorted,
	sortIndex: 3,
	sortReverse: true
});

jquery('.edit-field').edEditMenu('#group1');

if ($('grade-delete')) {
	new edConfirm('#grade-delete', _('Želite li obrisati ocjenu') + '?');
}