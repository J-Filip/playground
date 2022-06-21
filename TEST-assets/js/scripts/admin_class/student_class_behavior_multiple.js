$('multiple_sp_apply').addEvent(default_event_type, function(ev) {
	var sp = $('multiple_sp').get('value');
	$$('.sy_part').each(function(item, index) {
		item.getElement('option[value='+sp+']').set('selected', 'selected');
	});
});

$('multiple_behavior_apply').addEvent(default_event_type, function(ev) {
	var bh = $('multiple_behavior').get('value');
	$$('.bh').each(function(item, index) {
		item.getElement('option[value='+bh+']').set('selected', 'selected');
	});
});
