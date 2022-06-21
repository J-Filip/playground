window.addEvent('domready', function() {
	if ($('title')) {
		new Meio.Autocomplete.Select('title', '/admin_user/search_titles/', {
			syncName: false,
			minChars: 3,
			maxVisibleItems: 5,
			filter: {
				type: 'contains',
				path: 'value'
			},
			urlOptions: {
				max: false
			},
			valueFilter: function(data){
				return data.id;
			},
			valueField: $('title_id')
		});
	}

if ($('sync-username')){
	$('sync-username').addEvent(default_event_type, function(e){
		e.stop();
		var button = this;

		button.addClass('animate-spin');

		var completed = false;
		var checkCompletion = function (){
			if (completed === true) {
				button.removeClass('animate-spin');
			}

			clearInterval(interval);
		};

		/* animation time for one spin is 2s */
		var interval = setInterval(checkCompletion, 1000);

		var req = new Request.JSON({
			url: $('sync-username').getProperty('data-url'),
			onSuccess: function(response) {
				if (response.error === false) {
					var oib = $('sync-username').getProperty('data-oib');
					$('hredupersonuniqueid').set('value',response.username);
					$('email').set('value', response.username);
					$('username-'+oib).set('html',response.username);
				}
				$('response-msg').set('html', response.message);

				completed = true;
			},
			onError: function(){
				$('response-msg').set('html', _('Greška prilikom dohvata korisničke oznake!'));

				completed = true;
			},
			onFailure: function(){
				$('response-msg').set('html', _('Greška prilikom dohvata korisničke oznake!'));

				completed = true;
			}
		}).get();

	});
}

var oib_input = jquery('#oib');
var error_msg = jquery('#oib-error-msg');
var existing_msg = jquery('#oib-info-msg');

var submit_button = jquery('#submit');

var hredupersonuniqueid = jquery('#hredupersonuniqueid');
var username_error_msg = jquery('#hredupersonuniqueid-error');

function ajaxCheckOib(oib){
	return jquery.ajax
	('/admin_user/is_valid_oib/' + oib,
	{ 
		method : 'GET',
		success: function(result)
		{	
			try {
				response = JSON.parse(result);
				if(!response.status) showErrorMsg(response);
			}
			catch(err) {
				edFlashAlert('error','Došlo je do pogreške!');
			}
		}
	});
}

function ajaxCheckUsername(username){
	jquery.ajax
	('/admin_user/ajax_is_valid_email/' + encodeURIComponent(username),
	{ 
		method : 'GET',
		success: function(result)
		{	
			try {
				valid = JSON.parse(result);
				if(!valid) showUsernameErrorMsg();
			}
			catch(err) {
				edFlashAlert('error','Došlo je do pogreške!');
			}
		}
	});
}

function ajaxCheckIfExistingUser(oib){
	return jquery.ajax
	('/admin_user/isExistingUserFromAnotherSchool/' + oib,
	{ 
		method : 'GET',
		success: function(result)
		{	
			try {
				status = JSON.parse(result);
				if(status == 'true') showExistingUser();
			}
			catch(err) {
				edFlashAlert('error','Došlo je do pogreške!');
			}
		}
	});
}

var enableSubmit = function()
{
	submit_button.removeAttr('disabled');
	submit_button.removeClass('disabled');
}

var disableSubmit = function()
{
	submit_button.attr('disabled', 'disabled');
	submit_button.addClass('disabled');	
}

var checkIfUsernameIsValid = function(username){
	hideUsernameErrorMsg();
	ajaxCheckUsername(username);
}

var checkOIB = function(oib){
	enableSubmit();
	hideErrorMsg();
	hideExistingUser();
	hideUsernameErrorMsg();

	jquery.when( ajaxCheckOib(oib), ajaxCheckIfExistingUser(oib) ).done( function(){
		if( canCheckUserName() ) checkIfUsernameIsValid( String.trim(hredupersonuniqueid.val()) ); 
	});
}

var showErrorMsg = function(response){
	error_msg.removeClass('hide');
	error_msg.children('p').text(response.message);
	disableSubmit();
}

var hideErrorMsg = function(){
	error_msg.addClass('hide');
}

var showUsernameErrorMsg = function(){
	username_error_msg.removeClass('hide');
	disableSubmit();
}

var hideUsernameErrorMsg = function(){
	username_error_msg.addClass('hide');
}

var showExistingUser = function(){
	existing_msg.removeClass('hide');
}

var hideExistingUser = function(){
	existing_msg.addClass('hide');
}

var isUsernameValidFormat = function(username){
	regex = new RegExp('^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$','i');
	return regex.test(username);
}

var canCheckUserName = function(){

	if( !error_msg.hasClass('hide') ) return false;
	if( !existing_msg.hasClass('hide') ) return false;
	if( !isUsernameValidFormat( String.trim(hredupersonuniqueid.val()) ) ) return false;
	if( oib_input.val().length != 11 ) return false;
	
	return true;
}

if(!oib_input.hasClass('disabled')){
	oib_input.on('focusout',function(){
		if(jquery(this).val().length == 11){
			checkOIB(jquery(this).val())		
		}
	});
}

if(!hredupersonuniqueid.hasClass('disabled')){
	hredupersonuniqueid.on('focusout',function(){
		username = String.trim(jquery(this).val());
		if( canCheckUserName() ){
			checkIfUsernameIsValid(username);
		}
	});
}

});
