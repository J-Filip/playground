$$('.checkbutton').addEvent(default_event_type, function(){
	$$('.checkbutton').addClass('unchecked');
	this.removeClass('unchecked');

	switch(this.get('id')) {
		case 'true': $('accepted').set('value','true');
					break;
		case 'false': $('accepted').set('value','false');
					break;
		default:	break;
	}
});