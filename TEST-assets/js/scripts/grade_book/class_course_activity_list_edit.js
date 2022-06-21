if ($('class_course_activity')) {
	new Meio.Autocomplete.Select('class_course_activity', '/grade_book/search_course_activities/', {
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

jquery('.activity-element').edEditMenu('#group1');

new edConfirm('.delete', _('Želite li obrisati element vrednovanja?'));
