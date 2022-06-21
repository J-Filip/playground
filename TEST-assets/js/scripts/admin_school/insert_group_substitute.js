var submit_classes = function() {
	var selected_classes = [];

	$$('.checkbutton.active').each(function(item) {
		if(!item.hasClass('hide')) {
			selected_classes.push(item.get('id'));
		}
	});

	if(selected_classes.length > 0) {
		$('selected_classes').set('value', JSON.stringify(selected_classes));
	}
	else {
		$('selected_classes').set('value','');
	}
};

var add_check_bttn_events = function() {
	$$('.checkbutton').addEvent(default_event_type, function(ev) {
		if(this.hasClass('uneditable')) return;

		this.toggleClass('unchecked');

		if(!this.hasClass('unchecked')) {
			this.addClass('active');
		} else {
			this.removeClass('active');
		}

		submit_classes();
	});
};

var fetch_classes = function(course_id) {
	var classes = new Request.JSON({
		url:'/admin_school/ajax_school_class_for_teacher_course/' + course_id + '/' + $('teacher_id').get('value') + '/' + $('schoolyear_id').get('value'),
		onSuccess: function(data) {
			var values = Object.values(data);
			render_classes(values);
		},
		onFailure: function() {}
	}).get();
}

var render_classes = function(values) {
	var container = $('classes_container');
	container.empty();
	
	if(values.length < 1) {
		container.adopt(new Element('p', { 'text': _('Nastavnik ne predaje odabrani predmet niti jednom razredu.') }));
		return;
	}

	values.each(function(item) {
		var class_name = item.class_type_name.contains(_('pripremni')) ? item.value + ' ' + _('(prip.)') : item.value;
			
		var sub_suffix = item.is_substitute === 't' ? ' ' + _('(Z)') : '';
		var sub_tooltip = item.is_substitute === 't' ? ' ' + _('(zamjena)') : '';

		var sc = new Element('a', {'class': 'checkbutton unchecked m5 tipper hide', 'id': item.id, 'text': class_name + sub_suffix, 'data-tooltip': item.class_type_name + sub_tooltip });
		//hardcoded bljak, checkbutton = 45+10
		if(sc.text.length > 4) {
			sc.setStyle('width', '100px');
		}
		if(sc.text.length > 7) {
			sc.setStyle('width', '155px');
		}
		if(sc.text.length > 10) {
			sc.setStyle('width', '210px');
		}
		if(item.is_elementary || item.is_ib || item.is_hospital || item.is_virtual || item.is_oos) {
			sc.addClass('elementary');
		} else {
			sc.addClass('highschool');
		}
			
		container.adopt(sc);
	});

	add_check_bttn_events();
	new edTips('.tipper');
}

$('select_all').addEvent(default_event_type, function(ev) {
	$$('.checkbutton').removeClass('unchecked');
	$$('.checkbutton').addClass('active');

	submit_classes();
});

picker.addEvent('close', function(e) {
	var minDate = new Date($('date_from').get('value'));
	var maxDate = new Date($('date_to').get('value'));
	if(minDate > maxDate) {
		setTimeout(function() {
			edAlert(_('Greška - datum završetka mora biti nakon datuma početka. Molimo odaberite ispravan datum početka ili završetka'));
			$('datepicker_date_to').set('value','');
			$('date_to').set('value','');
			$('datepicker_date_from').blur();
			$('datepicker_date_to').blur();
		}, 300);
	}
});

if($('group_substitute_id').get('value') == '') 
{
	$('teacher_id').addEvent('change', function(ev) {
	//dohvati predmete koje nastavnik predaje
		var homeroomCourseID = $('course_homeroom').get('value');

		var courses = new Request.JSON({
			url:'/admin_school/get_active_courses/'+this.value+'/true',
			onSuccess: function(data) {
				var select = $('course_id');
				select.empty();
				select.adopt(new Element('option', {'text': _('--- predmet ---'), 'value':'', 'selected': 'selected'}));
				data.each(function(item) {
					var newEl = new Element('option', {'value': item.course_id, 'text': item.name });
					if(item.course_id == homeroomCourseID) {
						newEl.setStyle('font-weight', 'bold');
					}
					select.adopt(newEl);
				});
			},
			onFailure: function () {}
		}).get();
	});

	$('course_id').addEvent('change', function(ev) {
		//dohvati dostupne zamjene
		var selected_teacher = $('teacher_id').get('value');
		var selected_course = this.get('value');
		var substitute_select = $('substitute_teacher_id');

		var available_subs = new Request.JSON({
			url:'/admin_school/ajax_teacher_for_course/'+selected_course,
			onSuccess: function(response) {
				substitute_select.empty();
				substitute_select.adopt(new Element('option', {'text': _('--- zamjena ---'), 'value': '', 'selected': 'selected'}));
					var teaches = new Element('optgroup', {'label': _('Predaju predmet:')});
					response.data.t.each(function(item) {
						if(item.id !== selected_teacher) {
							teaches.adopt(new Element('option', {'value': item.id, 'text': item.value, 'data-qualified': true}));
						}
					});

					var teaches_not = new Element('optgroup', {'label': _('Ne predaju predmet:')});
					response.data.f.each(function(item) {
						teaches_not.adopt(new Element('option', {'value': item.id, 'text': item.value, 'data-qualified': false }));
					});

					substitute_select.adopt(teaches, teaches_not);
			},
			onFailure: function() {}
		}).get();

		//dohvati razrede u kojima nastavnik predaje odabrani predmet
		fetch_classes(selected_course);
	});

	$('substitute_teacher_id').addEvent('change', function(ev) {
		$$('.checkbutton').addClass('unchecked');
		$$('.checkbutton').addClass('hide');
		$$('.checkbutton').removeClass('active');
		submit_classes();

		var option = this.getSelected();

		if(option.get('value') != '') {
			if(option.get('data-qualified') == 'true') {
				$$('.checkbutton').removeClass('hide');
			} else {
				$$('.checkbutton.elementary').removeClass('hide');
			}
		}
	});
}
else {
	add_check_bttn_events();
	submit_classes();
}

