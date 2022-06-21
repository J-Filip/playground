var selectDiv = $('add-student-select');
var selectDivSize = selectDiv.getSize();

var bind_delete_events = function() {
	$$('.token .delete').removeEvents();

	$$('.token .delete').addEvent(default_event_type, function(ev) {
		ev.stopPropagation();
		selectDiv.setStyle('visibility', 'hidden');
	});

	new edConfirm('.token .delete', _('Želite li obrisati unos za') + ' <b>confirm-msg</b>' + '?', { onConfirm: function(ev, el) {
			ev.stopPropagation();

			var timetable_id = el.get('data-timetable-id');
			var request = new Request.JSON({
				url:'/music_school/delete_teacher_timetable/' + timetable_id,
				onSuccess: function(data) {
					if(data.status) {
						$(data.teacher_timetable_id + '.token').destroy();
					}
				},
				onFailure: function () {}
			}).get();
		}
	});
};

var bind_update_events = function() {
	$$('.update-duration-form').removeEvents();
	$$('.update-duration').removeEvents();

	$$('.update-duration-form').addEvent('submit', function(ev) {
		ev.preventDefault();

		var timetableID = this.get('data-timetable-id'); 
		var newDuration = $('update-input-' + timetableID).get('value');
		
		var tokenElement = $(timetableID + '.token');
		var entryElement = $('entry-data-' + timetableID);
		var updateElement = $('update-duration-' + timetableID);
		var submitElement = $('submit-' + timetableID);
		var endTimeLabel = $('endtime-' + timetableID);

		var request = new Request.JSON({
			url: '/music_school/update_teacher_timetable/' + timetableID + '/' + newDuration,
			onSuccess: function(data) {
				switch(data.status) {
					case 'success':
						tokenElement.set('data-duration', newDuration);
						endTimeLabel.set('text', data.endtime);
						entryElement.removeClass('inactive')
						updateElement.addClass('inactive');
						submitElement.removeClass('hide');
						resizeTokens();
						break;
					case 'error': 
						new edAlert(_('Uređivanje unosa nije uspjelo!'));
						break;
					default: break;
				}
			},
			onFailure: function () {},
			onComplete: function() {}
		}).get();	
	});

	$$('.update-duration').addEvent(default_event_type, function(ev) {
		var timetable_id = this.get('data-timetable-id');
		
		var tokenElement = $(timetable_id + '.token');

		var entryElement = $('entry-data-' + timetable_id);
		var updateElement = $('update-duration-' + timetable_id);

		entryElement.toggleClass('inactive');
		updateElement.toggleClass('inactive');

		
		/*var tokenHeight = tokenElement.getSize().y;
		parentElement.toggleClass('active');

		if(parentElement.hasClass('active')) {
			tokenElement.setStyles({ 'height': (tokenHeight + 70) + 'px'});
		}
		else {
			tokenElement.setStyles({ 'height': (tokenHeight - 70) + 'px'});
		}*/
	});
}

var showSelectDIV = function(position) {
	selectDiv.setStyle('left', (position.x + 10) + 'px');
	selectDiv.setStyle('top', ((position.y + 10) - $(document.body).scrollTop) + 'px');

	var updatedPosition = selectDiv.getPosition();

	var bottomEdge, topEdge, rightEdge;

	if(Browser.ie && Browser.version === 8) {
		bottomEdge = document.body.clientHeight - (selectDivSize.x + updatedPosition.x);
		topEdge = updatedPosition.y;
	}
	else {
		rightEdge = window.innerWidth - (selectDivSize.x + updatedPosition.x) - 60;
		bottomEdge = window.innerHeight - (selectDivSize.y + updatedPosition.y) - 60;
		topEdge = updatedPosition.y;
	}

	selectDiv.setStyle('height', 'auto');

	if(rightEdge < 0) {
		selectDiv.setStyle('left', (position.x + 10 + rightEdge) + 'px');
	}
	if(bottomEdge < 0) {
		var currentTop = parseInt(selectDiv.getStyle('top'));

		selectDiv.setStyles({'top': (currentTop + bottomEdge) + 'px'});
	}

	var docHeight;

	/*if(selectDiv.getPosition().y < 80) {
		if(Browser.ie && Browser.version === 8)
		{
			docHeight = document.body.clientHeight;
		}
		else {
			docHeight = window.innerHeight;
		}

		selectDiv.setStyles({
			'height': (docHeight - 85) + 'px',
			'top': '90px'
		});

		selectDiv.getElements('ul#student-list, ul#class-list').setStyles({
			'height': (docHeight - 200) + 'px'
		});
	}*/

	$('submit').removeClass('hide');

	selectDiv.setStyle('visibility', 'visible');
}

var hideSelectDIV = function() {
	selectDiv.setStyle('visibility', 'hidden');
}

var resizeTokens = function() {
	var selectedShiftID = $$('.cc-nav.active')[0].get('data-shift-id');

	var firstTableHeaderSize = $$('#' + selectedShiftID + ' th')[1].getSize();

	var height = firstTableHeaderSize.y;
	var width  = firstTableHeaderSize.x;
	
	var item_height = 0, parent, multiplier = 0;
	var shift_id, weekday_id, interval;
	var cell_order = 0;

	$$('.token').each(function(item, index) {
		shift_id = item.get('data-shift-id');
		weekday_id = item.get('data-weekday-id');
		interval = item.get('data-interval');

		if(shift_id != selectedShiftID) item.addClass('hide');

		multiplier = Math.ceil(item.get('data-duration')/15);
		
		item_height =  multiplier*height - 10;
		item_height = item_height > 40 ? item_height : 40;

		parent = $(shift_id + '-' + weekday_id + '-' + interval);
		position = parent.getPosition();
		cell_order = parent.getParent().get('data-cell-order');

		item.setStyles({ 'top' : position.y, 'left': position.x });
		item.setStyles({'width': (width - 10) + 'px'});
		item.setStyles({'height': item_height});
		item.setStyles({'z-index': cell_order});
	});
}

var switchShiftDisplay = function() {
	$$('li.token').addClass('hide');

	var shift_id = $$('.cc-nav.active')[0].get('data-shift-id');
	var elements = $$('li.token[data-shift-id="' + shift_id + '"]');

	elements.removeClass('hide');
}

if($$('.cc-nav')) {
	$$('.cc-nav').addEvent(default_event_type, function(ev) {
		$$('.cc-nav.active').removeClass('active');
		this.addClass('active');

		$$('.log-table').addClass('hide');
		$(this.get('data-shift-id')).removeClass('hide');

		switchShiftDisplay();
		resizeTokens();
	});
}

$$('#add-entry-switcher li').addEvent(default_event_type, function(ev) {
	switch(this.get('id')) {
		case 'students-switch': 
			$$('.student-class-entry').removeClass('hide');
			$$('.school-class-entry').addClass('hide');
			break;
		case 'classes-switch':
			$$('.student-class-entry').addClass('hide');
			$$('.school-class-entry').removeClass('hide');
			break;
		default: break;
	}
});

$$('#add-student-select').addEvent(default_event_type, function(ev) {
	ev.stopPropagation();
});

$$('body, #add-student-select #close').addEvent(default_event_type, function(ev) {
	selectDiv.setStyle('visibility', 'hidden');
});

$('schoolyear_id').addEvent('change', function(ev) {
	var schoolyear_id = this.get('value');
	window.location = '/music_school/teacher_timetable/' + schoolyear_id;
});

$$('.token').addEvent('click', function(ev) { ev.stopPropagation(); });
$$('.token').addEvent('mouseover', function(ev) { ev.stopPropagation(); });

$$('.work-hour').addEvent(default_event_type, function(ev) {
	ev.stopPropagation();

	$$('.work-hour.active').removeClass('active');
	this.addClass('active');
	
	$('interval-title').set('text', this.get('data-interval-begin'));

	selectDiv.set('data-shift-id', this.get('data-shift-id'));
	selectDiv.set('data-weekday-id', this.get('data-weekday-id'));
	selectDiv.set('data-start-time', this.get('data-interval-begin'));

	var position = this.getPosition();
	showSelectDIV(position);
});

$$('#add-student-select .entry').addEvent(default_event_type, function(ev) {
	ev.stopPropagation();

	$$('#add-student-select .entry').removeClass('active');
	$(this).addClass('active');

	if(this.hasClass('student-class-entry')) {
		$('entry_type').set('value', 'student_class');
		$('entry_id').set('value',  this.get('data-student-class-id'));
	}
	else {
		$('entry_type').set('value', 'school_class');
		$('entry_id').set('value',  this.get('data-school-class-id'));
	}
});

$('add-entry-form').addEvent('submit', function(ev) {
	ev.preventDefault();
	hideSelectDIV();

	var schoolyear_id = $('schoolyear_id').get('value');
	var shift_id = selectDiv.get('data-shift-id');
	var weekday_id = selectDiv.get('data-weekday-id');
	var start_time = selectDiv.get('data-start-time').split(':');
	var entry_type = $('entry_type').get('value');
	var entry_id = $('entry_id').get('value');
	var duration = $('duration').get('value');

	var start_hour = start_time[0];
	var start_minutes = start_time[1];
	

	var request = new Request.JSON({
		url: '/music_school/add_teacher_timetable/' + schoolyear_id + '/' + shift_id + '/' + weekday_id + '/' + entry_type + '/' + entry_id + '/' + start_hour + '/' + start_minutes + '/' + duration,
		onSuccess: function(data) {
			switch(data.status) {
				case 'added':
					var li = new Element('li', {
						'class': 'token', 
						'id' : data.teacher_timetable_id + '.token', 
						'data-shift-id': data.shift_id, 
						'data-weekday-id': data.weekday_id, 
						'data-interval': data.start_time, 
						'style': 'position: absolute; z-index: 5;',
						'data-duration': data.duration

					});
					var entryDIV = new Element('div', {'id' : 'entry-data-' + data.teacher_timetable_id, 'class': 'entry-data-container' });
					var span = new Element('span', {'class':'text', 'html': '<b>' + data.entry_name + '</b><br>' + data.start_time + ' - ' + '<span id="endtime-' + data.teacher_timetable_id + '">' + data.end_time + '</span>'});
					entryDIV.adopt(span);
					
					var updateDIV = new Element('div', {'id' : 'update-duration-' + data.teacher_timetable_id, 'class': 'update-duration-container inactive' });
					var icon = new Element('i' ,{'class': 'icon-cancel delete', 'data-timetable-id': data.teacher_timetable_id, 'data-msg': data.start_time });
					var settings_icon = new Element('i', { 'class': 'icon-settings t-right update-duration', 'data-timetable-id': data.teacher_timetable_id });
					updateDIV.adopt(settings_icon);

					var form = new Element('form', {'class': 'update-duration-form', 'data-timetable-id': data.teacher_timetable_id });
					form.adopt(new Element('label', {'for': 'new_duration_' + data.teacher_timetable_id, 'text': 'Trajanje: '}));
					form.adopt(new Element('input', {'type': 'text', 'id': 'update-input-' + data.teacher_timetable_id, 'value': data.duration, 'style': 'width:3em; text-align:center;'}));
					form.adopt(new Element('span', {'text': ' minuta'}));
					form.adopt(new Element('br'));
					form.adopt(new Element('input', {'type': 'submit', 'id': 'submit-' + data.teacher_timetable_id, 'class':'button', 'value': 'Spremi'}));
					updateDIV.adopt(form);

					$('body').adopt(li.adopt(entryDIV, settings_icon, icon, updateDIV), 'top');

					resizeTokens();
					bind_delete_events();
					bind_update_events();
					break;

				case 'existing': break;
				case 'error': 
					new edAlert(_('Dodavanje unosa nije uspjelo!'));
					break;
				default: break;
			}
		},
		onFailure: function () {},
		onComplete: function() {}
	}).get();
});

window.addEvent('domready', function(ev) {
	$$('#sub-menu').setStyles({'z-index': 500});
	$$('#site-menu').setStyles({'z-index': 510});
	$$('#header').setStyles({'z-index': 520});

	setTimeout(function() {
		$$('div#modal').setStyles({'z-index': 600});
	}, 500);

	resizeTokens();
	bind_delete_events();
	bind_update_events();
});

window.addEvent('resize', function(ev) {
	resizeTokens();
});