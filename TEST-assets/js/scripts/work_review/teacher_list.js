if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-class-type-id')).removeClass('hide');
	});
}

//override za hover https://phabricator.razus.carnet.hr/T142
var class_course_row = jquery('.class_course_row');

jquery('.class_course_row').hover(
	function(){
		var cc_id = jquery(this).data('class-course-id');
		jquery('tr[data-class-course-id='+cc_id+']').addClass('is-hover');
	},
	function(){
		var cc_id = jquery(this).data('class-course-id');
		jquery('tr[data-class-course-id='+cc_id+']').removeClass('is-hover');
	}
);
