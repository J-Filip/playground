jquery('.sc-edit').edEditMenu('#group1');

new edConfirm('.delete', _('Želite li obrisati razredni odjel?'));
new edConfirm('.unlock-class', _('Želite li otključati razredni odjel?'));

// Bootstrap dropdown
$('dropdown-toggle').addEvent(default_event_type, function(e){
	new DOMEvent(e).stop();
	var menu = $('dropdown-menu');
	menu.toggle();
});

$(document.documentElement).addEvent('click', function(){
	var menu = $('dropdown-menu');
	menu.hide();
});
