var languages_ms = new edMultiSelect({ elements : $$('.ed-row.touch-row'), input: $$('#selected_fields'), keys: ['id'] });

var json = $('selected_fields').get('value');

if(json) {
	var values = JSON.parse(json);
	values.each(function(item,index){
		$(item.id).addClass('active');
		$(item.id).removeClass('inactive');
		var icon = $(item.id).getFirst('.right');
		icon.set('class','icon-ok green right');
	});
}

languages_ms.submit_fields();
