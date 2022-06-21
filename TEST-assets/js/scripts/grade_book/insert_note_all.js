$('copy_bttn').addEvent('click', function() {
	$$('.note').each(function(el){
		if(!el.hasClass('inactive')){
			el.set('value', $('note_main').get('value'));
		}
	});
});
