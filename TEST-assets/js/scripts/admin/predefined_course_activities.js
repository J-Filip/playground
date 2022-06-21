jquery('td.course-activity').edEditMenu('#group1');

$$('.nav-item a').addEvent(default_event_type, function(e) {
	var book_type_id = this.get('data-book-type-id');
	var class_type_id = this.get('data-class-type-id');

	$$('.nav-item a').removeClass('active');

	this.addClass('active');

	$$('.log-table').addClass('hide');
	$('book-type-' + book_type_id + '-class-type-' + class_type_id).removeClass('hide');

	$$('.activity-input').addClass('hide');
	$('input-form-' + book_type_id + '-' + class_type_id).removeClass('hide');
});

if ($('activity_name')) {
	new Meio.Autocomplete.Select('activity_name', '/grade_book/search_course_activities/', {
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
		valueField: $('activity_id')
	});
}
