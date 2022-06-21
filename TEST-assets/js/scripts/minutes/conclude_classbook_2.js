if($$('.unlock')) {
	$$('.unlock').addEvent('click', function(e) {
		if(!window.confirm(_('Želite li obrisati zapis razrednika?'))) {
			return false;
		}
	}); 
}
