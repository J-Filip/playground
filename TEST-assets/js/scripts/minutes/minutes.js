jquery('.activity-element').edEditMenu('#group1');

new edConfirm('.delete', _('Želite li obrisati zapisnik?'));
new edConfirm('.delete-planning-file', _('Želite li obrisati datoteku') + ' confirm-msg?');

var table = new HtmlTable($('minutes'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 1});
