var students_ms = new edMultiSelect({ elements: $$('.ed-row.touch-row'), input: $$('#selected_fields'), keys: ['id', 'text'] });

var json = $('selected_fields').get('value');

if(json) {
	var values = JSON.parse(json);
	values.each(function(item,index){
		$(item.id).addClass('active');
		$(item.id).removeClass('inactive');
		var icon = $(item.id).getFirst('.right');
		icon.set('class','icon-ok green right');
	});
} else {
	$('name').set('class','ed-row select-row active');
	$('last_name').set('class','ed-row select-row active');
	$('birthday').set('class','ed-row select-row active');

	$('name').getFirst('.right').set('class','icon-ok green right');
	$('last_name').getFirst('.right').set('class','icon-ok green right');
	$('birthday').getFirst('.right').set('class','icon-ok green right');
}

students_ms.submit_fields();

$('select_all').addEvent('click', function(){
	students_ms.select_all();
});

$('submit').addEvent(default_event_type, function(ev) {
	if($('selected_fields').value === '[]') {
		ev.stop();
		edAlert(_('Molimo odaberite atribute za ispis'));
		$('submit').setStyle('visibility', 'visible');
	}
});
