jquery('.work-hour').edEditMenu('#group1');

new HtmlTable($('wh-table'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0, sortReverse: true });

if($('work-hour-delete')) {
	new edConfirm('#work-hour-delete', _('Želite li obrisati unos') + '?');
}
