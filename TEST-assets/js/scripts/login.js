$('login').addEvent('submit', function(){
	$('client_submit_timestamp').set('value', Date.now());
});

$('pass-tip').addEvent(default_event_type, function(ev) {
	edAlert(_('Ukoliko koristite fizički token, potrebno je upisati zajedno PIN i šesteroznamenkastu jednokratnu lozinku sa tokena.') + '<br /><br />' + _('Ukoliko koristite CARNet mToken mobilnu aplikaciju, potrebno je upisati samo jednokratnu lozinku koju je generirao mToken.'), {style: 'text-align: left !important;'});
});

//upozorenje o preniskoj rezoluciji
var checkScreenSize = function (window_height, window_width){
	if (jquery('#flash-message-container').children().hasClass('resolution')){
		if ( ((window_width > 767 && window_height > 500))){
			jquery('#flash-message-container').find('.resolution').remove();
		}
	} else if ((window_width <= 767 || window_height <= 500)){	
		edFlashAlert('error','Vaša rezolucija je manja od preporučene te nije podržana');
	}
}

jquery(window).on('resize', function(){
	checkScreenSize(innerHeight, innerWidth);
});

checkScreenSize(window.innerHeight, window.innerWidth);
