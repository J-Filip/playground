var timetable_editable = false;

if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-shift-id') + '-' + this.get('data-class-type-id')).removeClass('hide');
	});
}

$('edit-switch').addEvent('click', function(ev) {
	timetable_editable = !timetable_editable;

	if(timetable_editable) {
		this.set('text', _('Završi uređivanje'));
	} else {
		this.set('text', _('Uredi tjedan'));
		selectDiv.setStyle('visibility', 'hidden');
	}
	this.toggleClass('dark-btn');

	if(!timetable_editable) {
		$$('.work-hour').removeClass('editable');
		$$('.tokens').addClass('hide');
		$$('.timetable_entry').removeClass('hide');
	} else {
		$$('.work-hour').addClass('editable');
		$$('.tokens').removeClass('hide');
		$$('.timetable_entry').addClass('hide');
	}
});

var selectDiv = $('add-course-select');
var selectDivSize = selectDiv.getSize();

var bind_delete_events = function() {
	$$('.token .delete').removeEvents();

	$$('.token .delete').addEvent(default_event_type, function(ev) {
		ev.stopPropagation();
		selectDiv.setStyle('visibility', 'hidden');
	});

	new edConfirm('.token .delete', _('Želite li obrisati predmet') + ' <b>confirm-msg</b> ' + _('za') + ' <b>confirm-msg1</b>. ' + _('sat') + '?', { onConfirm: function(ev, el) {
			ev.stopPropagation();

			var timetable_id = el.get('data-timetable-id');
			var request = new Request.JSON({
				url:'/work_review/ajax_delete_timetable/' + timetable_id,
				onSuccess: function(data) {
					if(data.status) {
						$(data.timetable_id + '.token').destroy();
						$(data.timetable_id + '.entry').destroy();
					}
				},
				onFailure: function () {}
			}).get();
		}
	});
};

$$('body, #add-course-select #close').addEvent(default_event_type, function(ev) {
	selectDiv.setStyle('visibility', 'hidden');
});

$$('.token').addEvent('click', function(ev) { ev.stopPropagation(); });
$$('.token').addEvent('mouseover', function(ev) { ev.stopPropagation(); });

$$('.work-hour').addEvent(default_event_type, function(ev) {
	if(!timetable_editable) {
		return;
	}

	$$('.work-hour.active').removeClass('active');

	ev.stopPropagation();

	this.addClass('active');

	var courses = selectDiv.getElements('ul li.class-course');
	courses.addClass('hide');

	var active_courses = selectDiv.getElements('ul li.class-course.ctid_' + this.get('data-class-type-id'));
	active_courses.removeClass('hide');

	$('school-hour-title').set('text', this.get('data-school-hour'));

	var position = this.getPosition();
	selectDiv.setStyle('left', (position.x + 30) + 'px');
	selectDiv.setStyle('top', (position.y + 10)  + 'px');

	var updatedPosition = selectDiv.getPosition();

	var bottomEdge, topEdge, rightEdge;

	if(Browser.ie && Browser.version === 8) {
		bottomEdge = document.body.clientHeight - (selectDivSize.x + updatedPosition.x);
		topEdge = updatedPosition.y;
	}
	else {
		rightEdge = window.innerWidth - (selectDivSize.x + updatedPosition.x);
		bottomEdge = window.innerHeight - (selectDivSize.y + updatedPosition.y) - 60;
		topEdge = updatedPosition.y;
	}

	selectDiv.setStyle('height', 'auto');

	if(rightEdge < 0) {
		selectDiv.setStyle('left', (position.x + 10 + rightEdge) + 'px');
	}
	if(bottomEdge < 0) {
		selectDiv.setStyle('top', position.y + bottomEdge);
	}

	var docHeight;

	if(selectDiv.getPosition().y < 80) {
		if(Browser.ie && Browser.version === 8)
		{
			docHeight = document.body.clientHeight;
		}
		else {
			docHeight = window.innerHeight;
		}

		selectDiv.setStyles({
			'height': (docHeight - 160) + 'px',
			'top': '90px'
		});

		selectDiv.getElements('ul').setStyles({
			'height': (docHeight - 200) + 'px'
		});
	}

	selectDiv.setStyle('visibility', 'visible');

	selectDiv.set('data-shift-id', this.get('data-shift-id'));
	selectDiv.set('data-weekday-id', this.get('data-weekday-id'));
	selectDiv.set('data-school-hour', this.get('data-school-hour'));
	selectDiv.set('data-class-type-id', this.get('data-class-type-id'));
});

$$('#add-course-select .class-course').addEvent(default_event_type, function(ev) {
	ev.stopPropagation();

	selectDiv.setStyle('visibility', 'hidden');

	var shift_id = selectDiv.get('data-shift-id');
	var weekday_id = selectDiv.get('data-weekday-id');
	var class_type_id = selectDiv.get('data-class-type-id');
	var school_hour = selectDiv.get('data-school-hour');
	var class_course_id = this.get('data-class-course-id');

	var request = new Request.JSON({
		url:'/work_review/ajax_insert_timetable/' + shift_id + '/' + weekday_id + '/' + school_hour + '/' + class_course_id + '/' + class_type_id,
		onSuccess: function(data) {
			switch(data.status) {
				case 'added':
					var li = new Element('li', {'class': 'token', 'id' : data.timetable_id + '.token'});
					var span = new Element('span', {'class':'text', 'text': data.course_name });
					var icon = new Element('i' ,{'class': 'icon-cancel delete', 'data-timetable-id': data.timetable_id, 'data-msg': data.course_name, 'data-msg1': data.school_hour });

					var span_entry = new Element('span', {'id': data.timetable_id + '.entry', 'class': 'timetable_entry bold hide', 'text': data.course_name });

					$$('.work-hour.active ul').adopt(li.adopt(span, icon));
					$$('.work-hour.active').adopt(span_entry);

					bind_delete_events();
					break;

				case 'existing': break;
				case 'error': break;
				default: break;
			}
		},
		onFailure: function () {},
		onComplete: function() {}
	}).get();
});

bind_delete_events();
