jquery('.cpr-edit').edEditMenu('#group1');
new edConfirm('#delete-activity', _('Želite li obrisati zapis o radu razrednog vijeća?'));

var table = new HtmlTable($('realizations'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0, sortReverse: true});