jquery('#teacher_course_id, #schoolyear_id').on('change', function(ev) {

	var schoolyearID = jquery('#schoolyear_id').val();
	var courseID = jquery('#teacher_course_id').val();

	window.location = "/settings/music_choose_individual_student/" + schoolyearID + '/' + courseID;
});

jquery('#user_id').on('change', function(ev) {
	var userID = jquery(this).val();
	if(userID != '') {
		jquery('.ed-row').addClass('hide');
		jquery('a[data-user-ids*=' + userID + ']').removeClass('hide');
	}
	else {
		jquery('.ed-row').removeClass('hide');
	}
});