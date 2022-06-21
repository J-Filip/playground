jquery('tr.school-edit').edEditMenu('#group1');
new edConfirm('.delete', 'Želite li obrisati zapis?');

var table = new HtmlTable($('school-list'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0});