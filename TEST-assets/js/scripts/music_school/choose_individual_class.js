var fetch_links = function() {
	var course_id = $$('.course.selected')[0].get('id');
	var schoolyear_id = $('schoolyear_id').get('value');
	var request = new Request.JSON({
		onSuccess: function(responseText) { generate_links(responseText); },
		onFailure: function(xhr) { generate_links(); },
		url: '/music_school/get_available_individual_students/' + course_id + '/' + schoolyear_id }).get();
};

var generate_links = function(json) {
	$('student_list').empty();
	var count = 0;
	for(var index in json) {
			if(typeof(json[index]) == 'function') continue;

			var text = json[index].school_class + ' - ' + json[index].last_name + ' ' + json[index].first_name;
			if(!json[index].status) {
				text += ' (ispisan)';
			}

			var row = new Element('a', { 'class': 'student ed-row touch-row', 'html': text, 'id': json[index].student_course_id });
			if(json[index].active) {
				row.addClass('active');
				row.grab(new Element('i', {'class': 'icon-ok delete-course green right'}));
			} else {
				row.addClass('inactive');
				row.grab(new Element('i', {'class': 'icon-cancel delete-course grey right'}));
			}

			if(!json[index].status) {
				row.addClass('grey');
			}

			$('student_list').grab(row);
			count++;
	}

	if(count === 0) {
		$('student_list').grab(new Element('p',{html:'<b>' + _('Nisu pronađeni učenici raspoloživi za dodavanje!') +'</b>'}));
	}

	$$('.student').addEvent('click',function(e) {
		if(this.hasClass('active')) {
			this.removeClass('active');
			this.addClass('inactive');
		} else {
			this.removeClass('inactive');
			this.addClass('active');
		}

		var student_course_id = this.get('id');
		var course_id = $$('.course.selected')[0].get('id');

		update_students(course_id, student_course_id);
	});
};

var update_students = function(course_id, student_course_id) {
	var request = new Request({
		onSuccess: function(response){
			fetch_links();
			$('msg').set('text','');
			if(!response) {
				$('msg').set('text',_('Dogodila se greška!'));
			}
		},
		url: '/music_school/add_individual_student/' + course_id + '/' + student_course_id}).get();
};

$$(".course").addEvent('click', function(e) {
	$$('.course').removeClass('selected');
	this.addClass('selected');
	fetch_links(this.get('id'));
});

$('schoolyear_id').addEvent('change', function(ev) {
	try {
		var course_id = $$('.course.selected')[0].get('id');	
	}
	catch(ex) {
		return;
	}
	
	fetch_links();
});
