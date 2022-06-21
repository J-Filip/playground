window.addEvent('domready', function(){
	$$('.fontsize-small').addEvent('click', function(e){
	document.documentElement.removeClass('large');
		document.documentElement.addClass('small');
		Cookie.write(cookieName, 'small', {duration: cookieDuration});
	});

	$$('.fontsize-normal').addEvent('click', function(e){
		document.documentElement.removeClass('small');
		document.documentElement.removeClass('large');
		Cookie.dispose(cookieName);
	});

	$$('.fontsize-large').addEvent('click', function(e){
		document.documentElement.removeClass('small');
		document.documentElement.addClass('large');
		Cookie.write(cookieName, 'large', {duration: cookieDuration});
	});
});
