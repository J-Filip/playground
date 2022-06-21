if ($('new_element')) {
	new Meio.Autocomplete.Select('new_element', '/grade_book/search_course_activities/', {
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