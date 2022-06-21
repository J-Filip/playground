var ids=[];
$$('.select-class').addEvent(default_event_type, function(e){
	this.toggleClass('selected');
	var sc_id=this.getProperty('data-sc-id');

	if (this.hasClass('selected')){
			ids.push(sc_id);
	}
	else {
		ids.erase(sc_id);
	}

	$('classes').value=ids;
});

$('submit-classes').addEvent(default_event_type, function(ev) {
	if (ids.length==0) {
		alert('Nije odabran niti jedan razred za izvoz.');
		return false;
	} else {
		$('create-classes').send();
	}
});