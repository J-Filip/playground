if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.group').addClass('hide');
		$(this.get('data-type-id')).removeClass('hide');
	});
}

var fetch_students = function(course_id) {
	var course_id = course_id;
	var schoolyear_id = $('schoolyear').get('value');

	var request = new Request({
		url:'/music_school/list_available_individual_class/' + course_id + '/' + schoolyear_id,
		onSuccess: function(returnData) {
			$('students-container').empty();

			data = JSON.parse(returnData);
			var total_students = data.total_students;

			if(total_students == 0) {
				var message = new Element('span', {'text': 'Za odabrani predmet nema odabranih učenika za individualnu nastavu' });
				var link = new Element('a', { 'href': '/music_school/choose_individual_class/', 'class': 'button2 ml10', 'text': 'Odaberi učenike za individualnu nastavu' });
				$('students-container').adopt(message);
				$('students-container').adopt(link);
				return;
			}

			Object.each(data.students, function(item, index) {
				var disabled = false;
				var text = item.value;

				if(item.substitute == 't') {
					if(!item.date_from && !item.date_to) {
						text += ' (Z)';
					} else {
						var df = new Date(item.date_from);
						var dt = new Date(item.date_to);
						var now = new Date();

						if((dt < now && item.date_to !== null) || df > now) disabled = true;

						text += ' (Z: ';
						text = item.date_from ? text + df.getDate() + '.' + (df.getMonth() + 1) +'.' + df.getFullYear() + '.' + ' ' : text + '.. ';
						text += '-';
						text = item.date_to ? text + dt.getDate() + '.' + (dt.getMonth() + 1) +'.' + dt.getFullYear() + '.)' : text + '..)';
					}
				}

				var link = new Element('a', { 'href': '/music_school/show_grade_book/' + item.id, 'class': 'ed-row touch-row', 'text': text });

				if(disabled) {
					link.set('href', '#');
					link.addClass('inactive');
				}

				$('students-container').adopt(link);
			
		});
	},
	onFailure: function () {}
	}).get();
}

if($('individual-class-form')) {
	fetch_students($('teacher_course_id').getSelected().get('value')[0]);

	$('teacher_course_id').addEvent('change', function(ev) {
		fetch_students(this.getSelected().get('value')[0]);
	});
}