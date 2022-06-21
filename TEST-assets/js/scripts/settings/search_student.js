if ($('student')) {
	new Meio.Autocomplete.Select('student', '/settings/search_students/', {
		syncName: false,
		minChars: 3,
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
		valueField: $('student_id')
	});
}
