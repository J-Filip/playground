var table = new HtmlTable($('tbl-student-absent-stats'), { sortable : true, classHeadSort : 'sort-asc', classHeadSortRev : 'sort-desc', onSort: sorted, sortIndex: 1, classNoSort: 'nosort'});

/* Rotate table headers */
window.addEvent('domready', function(){
	$$('#tbl-student-absent-stats th.rotate').rotateHeaders();
});
