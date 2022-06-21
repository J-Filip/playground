jquery('#toggle-student-class-ec').edSwitch('#student_class_ec');

new edConfirm('.remove-ec-profession', _('Želite li obrisati područje nadarenosti?'));

var sendToggleRequest = function(data) {
	var url = '/ec_student/toggle_ec_student';
	var csrf = jquery('#ci_csrf_token').val();

	data.ci_csrf_token = csrf;

	jquery.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(response) {
			var status = JSON.parse(response);

			if(response) {
				showStatus('ok');
				switch(data.action) {
					case 'add':
						showProfessions(true);
						break;
					case 'remove':
						showProfessions(false);
						break;
					default: break;
				}
			}
			else {
				showStatus('error');
			}
		}
	});

	return status;
}

var showStatus = function(status) {
	var waitingMsg = jquery('#loader-msg');
	var okMsg = jquery('#ok-msg');
	var errorMsg = jquery('#error-msg');

	jquery('.status-msg').addClass('hide');

	switch(status) {
		case "waiting":
			waitingMsg.removeClass('hide');
			break;
		case "ok":
			okMsg.removeClass('hide');
			break;
		case "error":
			errorMsg.removeClass('hide');
			break;
		default:
			break;
	}

	setTimeout(function() {
		jquery('.status-msg').addClass('hide');
	}, 5000);
}

var showProfessions = function(show) {
	var professions = jquery('#ec-profession-container');
	if(show) {
		professions.removeClass('hide');
	}
	else {
		professions.addClass('hide');
	}
}

jquery('#ecToggle').on('change', function(ev) {
	var value = JSON.parse(jquery('#student_class_ec').val().toLowerCase());
	var action = value ? 'add' : 'remove';

	var user_id = jquery('#user_id').val();
	var data = { 'user_id' : user_id, 'action' : action }; 

	showStatus('waiting');

	sendToggleRequest(data);
});