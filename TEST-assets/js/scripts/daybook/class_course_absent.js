jquery('#class_course').on('change', function(ev) {
	var wait = new edWait();
	wait.show();

	var classCourseID = jquery(this).val();
	window.location = '/daybook/class_course_absent/' + classCourseID;
});