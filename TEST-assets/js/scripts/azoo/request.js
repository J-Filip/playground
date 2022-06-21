var data = JSON.parse($('schools').get('value'));

new Meio.Autocomplete.Select('school_name', data, {
	syncName: false,
	minChars: 2,
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
	valueField: $('school_id'),
	listOptions: {
		classes: {
			odd: 'ma-odd needsclick',
			even: 'ma-even needsclick'
		}
	}
});

picker.addEvent('close', function(e) {
	var minDate = new Date($('date_from').get('value'));
	var maxDate = new Date($('date_to').get('value'));
	if(minDate > maxDate) {
		setTimeout(function() {
			edAlert('Greška - datum završetka mora biti nakon datuma početka. Molimo odaberite ispravan datum početka ili završetka');
			$('datepicker_date_to').set('value','');
			$('date_to').set('value','');
			$('datepicker_date_from').blur();
			$('datepicker_date_to').blur();
		}, 300);
	}
});

$('school_name').addEvent('focus', function(ev) {
	if(this.get('data-focused') === 'false') {
		this.set('data-focused', 'true');
		this.set('value', '');
		this.removeClass('placeholder');
	}
});
