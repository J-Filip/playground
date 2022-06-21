jquery('.edit-row, .edit-field').edEditMenu('#group1');

new edConfirm('.delete', _('Želite li obrisati unos') + '?');

var table = new HtmlTable($('ioop-table'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 1});