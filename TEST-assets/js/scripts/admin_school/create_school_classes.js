var ids = [];
$$('.select-class').addEvent(default_event_type, function(e){
	this.toggleClass('selected');
	var mzos_id = this.getProperty('data-mzos-id');

	if (this.hasClass('selected')){
		if (ids.length < 5) {
			ids.push(mzos_id);
		} else {
			this.toggleClass('selected');
			edAlert(_('Moguće je odabrati najviše 5 razrednih odjeljenja za uvoz!'));
		}
	}
	else {
		ids.erase(mzos_id);
	}

	$('classes').value = ids;
});
