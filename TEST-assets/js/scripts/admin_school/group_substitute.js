jquery('.edit-row').edEditMenu('#group1');

new edConfirm('.delete', _('Želite li obrisati grupnu zamjenu?'));

var table = new HtmlTable($('substitutes_table'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0});

$('schoolyear_id').addEvent('change', function(ev) {
	var sy_id = this.get('value');

	window.location = '/admin_school/group_substitute/' + sy_id;
});