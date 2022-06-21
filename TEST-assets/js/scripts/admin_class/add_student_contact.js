jquery('#toggle-email-notification').edSwitch('#email-notification');
jquery('#toggle-grades-access').edSwitch('#grades-access');

var emailNotificationInput = jquery('#email-notification');
var gradesAccessInput = jquery('#grades-access');

jquery('#toggle-email-notification').on('click',function(){
	switch(emailNotificationInput.val()) {
		case 'true':
			$('email').setProperty('data-allow-empty', 'false');
			$('email-required').removeClass('hide');
			break;
		case 'false':
			$('email').setProperty('data-allow-empty', 'true');
			$('email-required').addClass('hide');
			break;
		default:
			break;
	}
});

jquery('#toggle-grades-access').on('click',function(){
	switch(gradesAccessInput.val()) {
        case 'true': 
			$('oib').set('data-allow-empty', 'false');
			$('oib-required').removeClass('hide');
			break;
        case 'false':	
			$('oib').set('data-allow-empty', 'true')
			$('oib-required').addClass('hide');
			break;
		default:
			break;
	}
});