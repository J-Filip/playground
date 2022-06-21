var token = $('ci_csrf_token').get('value');

var fetch_links = function() {
	var teacher_id = $$('.teacher.selected').get('id');
	var request = new Request.JSON({
			onSuccess: function(responseText) {
				generate_links(responseText); 
			},
			onFailure: function(xhr) { 
				generate_links(); 
			},
			onError: function(text, error) {
				edAlert(_('Dogodila se greška') + '!<br><br>' + _('Molimo pokušajte osvježiti stranicu'));
			},
			url: '/admin_school/get_active_courses/'+teacher_id})
		.post('ci_csrf_token=' + token);
};

var generate_links = function(json) {
	$('courses_list').empty();
	var count = 0;
	for(var index in json) {
			if(typeof(json[index]) !== 'function') {
				var row = new Element('a', { 'class': 'course ed-row touch-row', html: json[index].name, 'id': json[index].school_teacher_course_id });
				row.grab(new Element('i', {'class': 'icon-cancel delete-course red right', 'data-msg': json[index].name}));
				$('courses_list').grab(row);
				count++;
			}
	}

	if(count === 0) {
		$('courses_list').grab(new Element('p',{html:'<b>' + _('Nastavnik nema dodijeljenih predmeta') + '</b>'}));
	}

	$$('.teacher.selected .course-count').set('html',count);

	new edConfirm('.delete-course', _('Želite li obrisati predmet') + ' confirm-msg?', { onConfirm: function(e,target) {
		target.getParent().removeClass('course');
		update_courses('delete',0,target.getParent().get('id'));
	}});

	$('searchbox').set('value', '');
	$('submit_course').removeClass('hide');
};

var update_courses = function(action,course_id,school_teacher_course_id) {
	
	var teacher_id = $$('.teacher.selected').get('id');
	var text = $('searchbox').get('value');

	var post;
	if (action === 'delete') {
		post = 'school_teacher_course_id=' + school_teacher_course_id;
	}
	else {
		post = 'user_id=' + teacher_id + '&course_id=' + course_id + '&text=' + text;
	}

	var request = new Request({
		onSuccess: function(){ fetch_links(); },
		url: '/admin_school/edit_teacher_course_action/' + action}).post(post+'&ci_csrf_token='+token+'&submit=Unesi');
};

$('available_courses').addEvent('submit', function(e) {
	e.stop();
	var course_id = $('course_id').get('value');
	update_courses('add',course_id);
});

$$(".teacher").addEvent(default_event_type, function(e) {
	if(edLayout.preventEvent) {
		return;
	}

	var teacher_id = this.get('id');
	$('searchbox').destroy();
	$('search').grab(new Element('input',{'id': 'searchbox', 'value': '' , 'name' : 'course_name',  'type' :  'text',  'class' : 'w60', 'style': 'padding: 5px;' }),'top');
	if ($('searchbox')) {
		var container = $$('.ma-container');
		if(container) {
			container.destroy();
		}

		new Meio.Autocomplete.Select('searchbox', '/admin_school/get_available_courses/' + teacher_id +  '/', {
			syncName: false,
			minChars: 3,
			maxVisibleItems: 5,
			filter: {
				type: 'contains',
				path: 'value'
			},
				urlOptions: {
				max: false
			},
			valueFilter: function(data){

					return data.id;
			},
			valueField: $('course_id'),
			listOptions: {
				classes: {
					odd: 'ma-odd needsclick',
					even: 'ma-even needsclick'
				}
			}
		});
	}

	$$('.teacher').removeClass('selected');
	this.addClass('selected');
	$('search').set('style','display:block;');

	fetch_links();
});
