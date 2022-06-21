jquery('td.course').edEditMenu('#group1');

$$('.nav-item a').addEvent(default_event_type, function(e) {
	var class_type_id = this.get('data-class-type-id');
	var book_type_id = this.get('data-book-type-id');

	$$('.nav-item a').removeClass('active');

	this.addClass('active');

	$$('.log-table').addClass('hide');
	$('book-type-' + book_type_id + '-class-type-' + class_type_id).removeClass('hide');

	$('book_type_id').set('value', book_type_id);
	$('class_type_id').set('value', class_type_id);
});

if ($('search_course')) {
	new Meio.Autocomplete.Select('search_course', '/admin_school/search_school_course/', {
		syncName: false,
		minChars: 3,
		maxVisibleItems: 5,
		filter: {
			type: 'contains',
			path: 'value'
		},
		urlOptions: {
			max: false
		},
		valueFilter: function(data){
			return data.id;
		},
		valueField: $('course_id')
	});
}