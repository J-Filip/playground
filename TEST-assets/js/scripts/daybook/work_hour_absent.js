new edConfirm('.work-hour-absent-delete', _('Želite li obrisati izostanak?'));

$$('form').addEvent('click',function(e){
	new DOMEvent(e).stop();
});
