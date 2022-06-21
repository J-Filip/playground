jquery('#attendance-export-form').on('submit', function(ev) {
	var button = jquery(this).find('input[type=submit]');
	var spinner = jquery('#spinner-animation');

	spinner.removeClass('hide');
	
	setTimeout(function() {
		button.removeClass('hide');
		spinner.addClass('hide');
	}, 5000);
});