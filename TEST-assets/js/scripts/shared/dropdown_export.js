/* Dropdown*/
var dropdownToggle = $('dropdown-toggle');
var dropdownMenu = $('dropdown-menu');

if(dropdownToggle) {
	dropdownToggle.addEvent(default_event_type, function(e){
		new DOMEvent(e).stop();
		dropdownMenu.toggle();
	});
}

$(document.documentElement).addEvent('click', function(){
	dropdownMenu.hide();
});
