var classes = $('selected_classes').get('value');
var attribs = $('selected_attributes').get('value');

var preselect = function(items) {
	items.each(function(item,index) {
		var el = $(item.id);
		el.removeClass('inactive');
		el.addClass('active');

		var icon = el.getFirst('.right');
		icon.set('class','icon-ok green right');
	});
};

if(classes) {
	var selected_classes = JSON.parse(classes);
	preselect(selected_classes);
}

if(attribs) {
	var selected_attributes = JSON.parse(attribs);
	preselect(selected_attributes);
} else {
	var selected_attributes = $$('#name, #last_name, #birthday');
	preselect(selected_attributes);
}

var ms_attrib = new edMultiSelect({ elements: $$('.ed-row.touch-row.attribute'), input: $$('#selected_attributes'), keys: ['id','text'] });
var ms_class = new edMultiSelect({ elements: $$('.ed-row.touch-row.class'), input: $$('#selected_classes'), keys: ['id','text'], limit: 10 });

ms_attrib.submit_fields();
ms_class.submit_fields();


$('select_all_attributes').addEvent(default_event_type, function(){
	ms_attrib.select_all();
});

$('select_all_classes').addEvent(default_event_type, function() {
	var scid = $('select_schoolyear').get('value');

	var selected = $$('[data-schoolyear-id='+scid+']');

	if(selected.length > ms_class.options.limit) {
		edAlert(_('Odabir svih razreda nije moguć') + '<br>(' + _('dopušteno je maksimalno') + ' ' + ms_class.options.limit + ' ' + _('razreda') + ')');
		return;
	}

	selected.removeClass('inactive');
	selected.addClass('active');
	
	$$('[data-schoolyear-id='+scid+'] i').set('class', 'icon-ok green right');

	ms_class.submit_fields();
});

$('submit').addEvent(default_event_type, function(ev) {
	if($('selected_classes').get('value') === '[]') {
		edAlert(_('Greška - za ispis je potrebno odabrati minimalno jedan razred. Molimo pokušajte ponovno'));
		ev.stop();
	} else {
		var wait = new edWait();
		wait.show();
	}
});

var filter = function(scid) {
	$$('.class').addClass('hide');
	$$('.shown').removeClass('shown');
	$$('.first-shown').removeClass('first-shown');
	$$('.last-shown').removeClass('last-shown');

	var shown;
	if(scid !== 0) {
		shown = $$('[data-schoolyear-id='+scid+']');
	} else {
		shown = $$('.class');
	}

	shown.removeClass('hide');

	shown[0].addClass('first-shown');
	shown[shown.length - 1].addClass('last-shown');

	$('selected_schoolyear').set('value', scid);
};

filter($('select_schoolyear').get('value'));

$('select_schoolyear').addEvent('change', function(ev) {
	filter(this.get('value'));

	$$('.ed-row.class.active').addClass('inactive');
	$$('.ed-row.class.active').removeClass('active');
	$$('.ed-row.class i').set('class', 'icon-cancel right');

	ms_class.submit_fields();
});

jquery('#toggle-show-inactive').edSwitch('#show_inactive');