var autocomplete_types = [
	{'value': 'opći sistematski', 'text': _('opći sistematski')},
	{'value': 'sistematski pregled zubi', 'text': _('sistematski pregled zubi')},
	{'value': 'cijepljenja', 'text': _('cijepljenja')}
];

var autocomplete_carriers = [
	{'value': 'školski liječnik/liječnica', 'text': _('školski liječnik/liječnica')},
	{'value': 'razrednik/razrednica', 'text': _('razrednik/razrednica')},
	{'value': 'stručni suradnik/suradnica', 'text': _('stručni suradnik/suradnica')}
];

var autocomplete_t = new Meio.Autocomplete($('content_value'), autocomplete_types, {
	delay: 200,
	minChars: 1,
	selectOnTab: true,
	valueFilter: function(data){
		return data.value;
	},
	filter: {
		type: 'contains',
		path: 'value'
	}
});

var autocomplete_c = new Meio.Autocomplete($('carrier'), autocomplete_carriers, {
	delay: 200,
	minChars: 1,
	selectOnTab: true,
	valueFilter: function(data){
		return data.value;
	},
	filter: {
		type: 'contains',
		path: 'value'
	}
});
