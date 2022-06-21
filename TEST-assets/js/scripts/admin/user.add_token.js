$('submit').addEvent(default_event_type, function(e){
	e.stop();
	if($('token_serial').value.length < 1) {
		edAlert('Molimo unesite serijski broj tokena');
		$('error-message').set('text', '');
		return 0;
	}

	var req = new Request.JSON({
		url: $('add_token').getProperty('action'),
		onSuccess: function(response) {
			if (response.error === 0) {
				window.location.reload();
			}

			$('error-message').set('html', response.message);
		},
		onError: function(){
			window.location.reload();
		},
		onFailure: function(){
			window.location.reload();
		}
	}).post($('add_token'));

});
