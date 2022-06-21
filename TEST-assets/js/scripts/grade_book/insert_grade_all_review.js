$('insert_form').addEvent('submit', function(ev) {
	$$('#submit_button, #submit_review_button').addClass('hide');
});

function setPageExitPrompt() {
	window.onbeforeunload = function(){ return _('Ocjene nisu upisane! Želite li odustati od upisa ocjena?'); };
}

function removePageExitPrompt() {
	window.onbeforeunload = null;
}

setPageExitPrompt();
