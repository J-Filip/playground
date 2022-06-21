var table = new HtmlTable($('tbl-work-hour-absent-schoolyear'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 0, thSelector  : 'th.sortable'});

var wait = new edWait();

$$('#schoolyear_id').addEvent('change', function(ev) {
	wait.show();

	var scid = $('schoolyear_id').get('value');
	window.location = '/reports/work_hour_absent_schoolyear/' + scid;
});

/* Rotate table headers */
window.addEvent('domready', function(){
	$$('th.rotate').rotateHeaders();
});
