var token = $('ci_csrf_token').get('value');

$$('.add-teacher').addEvent('click', function () {
	if (!this.hasClass('inactive')) {
		if (Modernizr.touch) {
			var wait = new edWait();
			wait.show();
		}
		var user_id = parseInt(this.get('data-user-id'));
		var self = this;

		var request = new Request.HTML({
			url: '/admin_school/add_hospital_teacher_action/',
			onSuccess: function (nodeList, object, html) {
				if (html == 'false') {
					alert(_('Dogodila se greška'));
					return false;
				}
				self.addClass('inactive');
				$('teacher-list').empty();
				$('teacher-list').innerHTML = html;
				if (Modernizr.touch) {
					setTimeout(function () {
						wait.hide();
					}, 500);
				}
			}
		});
		request.post('ci_csrf_token=' + token + '&user_id=' + user_id);
	}
});

$(document.body).addEvent("click:relay(.remove-teacher)", function () {
	if (Modernizr.touch) {
		var wait = new edWait();
		wait.show();
	}
	var user_school_id = parseInt(this.get('id'));
	var user_id = parseInt(this.get('data-user-id'));

	var request = new Request.HTML({
		url: '/admin_school/delete_hospital_teacher_action/',
		onSuccess: function (nodeList, object, html) {
			if (html == 'false') {
				alert(_('Dogodila se greška'));
				return false;
			}
			$('teacher-list').empty();
			$('teacher-list').innerHTML = html;
			$('teacher_' + user_id).removeClass('inactive');
			if (Modernizr.touch) {
				setTimeout(function () {
					wait.hide();
				}, 500);
			}
		}
	});

	request.post('ci_csrf_token=' + token + '&user_school_id=' + user_school_id);
});