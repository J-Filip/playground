$('matica-info').hide();
if ($('matica-error')){
	$('matica-error').addEvent(default_event_type, function(e) {
		$('matica-error-msg').toggle();
	});
}

$('matica-export').addEvent(default_event_type, function(e) {
	$('matica-info').show();
	$('matica-main').hide();
	//return false;
});
