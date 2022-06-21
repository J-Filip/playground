var ids=[];
$$('.select-class').addEvent(default_event_type, function(e){
	this.toggleClass('selected');
	var oib=this.getProperty('data-oib');

	if (this.hasClass('selected')){
			ids.push(oib);
	}
	else {
		ids.erase(oib);
	}

	$('teachers').value=ids;
	if (ids.length === 0){
		$('button-add').value=_('Dodaj korisnike');
	}
	else{
		$('button-add').value=_('Dodaj korisnike') + ' (' + ids.length + ')';
	}
});

$('select-all').addEvent(default_event_type, function(e){
	ids=[];

	$$('.select-class').each(function(item,index){
		item.addClass('selected');
		ids.push(item.getProperty('data-oib'));
	});
	$('teachers').value=ids;
	if (ids.length === 0){
		$('button-add').value=_('Dodaj korisnike');
	}
	else{
		$('button-add').value=_('Dodaj korisnike') + ' (' + ids.length + ')';
	}
});
