var csrfToken = jquery('#ci_csrf_token').val();

var progressMsg = jquery('#search-in-progress');
var notFoundMsg = jquery('#msg-not-found');
var resultMsg =  jquery('#user-data');

function reset() {
	progressMsg.addClass('hide');
	notFoundMsg.addClass('hide');
	resultMsg.addClass('hide');
}

function showProgress() {
	progressMsg.removeClass('hide');
}

function showResult(data) {
	progressMsg.addClass('hide');

	if(data.length == 0) {
		notFoundMsg.removeClass('hide');
	}
	else {
		resultMsg.removeClass('hide');

		resultMsg.find('#firstName').html(data.firstName);
		resultMsg.find('#lastName').html(data.lastName);
		resultMsg.find('#oib').html(data.oib);
		resultMsg.find('#hreduperson').html(data.username);
		resultMsg.find('#token').html(data.token);

		var lastLoginDate = new Date(data.lastLogin);
		console.log(lastLoginDate);

		resultMsg.find('#lastLogin').html(data.lastLogin);

		resultMsg.find('#schools').empty();

		if(data.schools.length == 0) {
			resultMsg.find('#schools').text('Korisnik nije dodan na školu');
		}
		else {
			jquery.each(data.schools, function(index, item) {
				resultMsg.find('#schools').append('<br />');
				resultMsg.find('#schools').append(jquery("<span></span>").text(item.name + ', ' + item.city));
			});
		}


	}
}

function find(username) {
	jquery.ajax({
		url: '/hd_tools/search_user_action',
		method: 'POST',
		dataType: 'json',
		data: {
			'username': username,
			'ci_csrf_token': csrfToken
		},
		success: function(data) {
			showResult(data);
		}
	});
}

jquery('#search-user-form').on('submit', function(ev) {
	ev.preventDefault();

	reset();
	showProgress();

	var username = jquery('#username').val();
	var result = find(username);
});

