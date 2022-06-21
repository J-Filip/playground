jquery('.activity-element').edEditMenu('#group1');
new edConfirm('.delete', _('Želite li obrisati unos?'));

var table = new HtmlTable($('practical-training-table'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0 });