if($('submit')) {
	$('submit').addEvent('click', function(e) {
		if(!window.confirm(_('Želite li zaključati razrednu knjigu? Nakon zaključavanja naknadne izmjene neće biti moguće.'))) {
			return false;
		}
	}); 
}
