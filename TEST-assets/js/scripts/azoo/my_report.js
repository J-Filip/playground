var table = new HtmlTable($('audit_table'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0 });
new edConfirm('#audit-delete','Želite li obrisati zahtjev? confirm-msg');
