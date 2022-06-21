var lastWorkHour = new Class({
	Implements: [Events, Options],
	options: {},
	initialize: function() {
		this.options.cc_id = $('class_course_id').value;
		this.options.gid   = $('group').value;
		this.options.schoolHour = $('school_hour').value;
		this.options.workday_id = $('workday_id').value;

		this.attach();
		this.updateLastHour();
	},

	attach: function() {
		$('class_course_id').addEvent('change', function (e){
			this.options.cc_id = e.target.value;
			this.updateLastHour();
		}.bind(this));

		$('group').addEvent('change', function(e){
			this.options.gid = e.target.value;
			this.updateLastHour();
		}.bind(this));
	},

	updateLastHour: function() {

		if(this.options.cc_id === '') return;

		if(this.options.gid === '') this.options.gid = 'none';
		var request_url = '/daybook/last_work_hour/' + this.options.cc_id + '/' + this.options.gid + '/' + this.options.workday_id + '/' + this.options.schoolHour;

		$('previous-work-hour').setProperty('html', '<i class="icon-spin animate-spin"></i>');
		$('exists_notification').addClass('hide');

		new Request.JSON({
			url: request_url,
			onSuccess: function (response) {
				if (response.error === false){
					var parts = response.date.split(/[- :]/),
					date = new Date(parts[0], parts[1]-1, parts[2]);

					var html = '[' +response.counter+ '] '+response.class_course;

					html += ' - ' + date.format('%d. %m. %Y.');

					if (response.group) {
						html += ' - grupa: ' + response.group;
					}

					html += ' - ' + response.note;

					$('previous-work-hour').setProperty('html', html);

					if(response.exists) {
						$('exists_notification').removeClass('hide');
					}

				}
				else {
					$('previous-work-hour').setProperty('html', _('Ne postoji podatak o prethodno upisanom satu'));
				}
			}
		}).get();
	}
});

new lastWorkHour();
jquery(document).ready(function(){

	var eschoolsToggle = jquery('#eschoolsToggle');
	var eschoolsInput = jquery('#e_schools_equipment_used');

	eschoolsToggle.on('click',function(e){
		switch(eschoolsInput.val()){
			case 't': 
				eschoolsInput.val('f');
				break;
			case 'f': 
				eschoolsInput.val('t');
				break;
			default: break;
		}
	});

	var confirmButton	= jquery('#ok_button');

	//switchanje tabova
	var switchTabs = function(tabID) {
		$$('.tab').removeClass('active');
		$$('[data-tab-id="' + tabID + '"]').addClass('active');

		$$('.tab-content').addClass('hide');
		$(tabID).removeClass('hide');
		//ako je edutorij tab i dohvaceni su materijali za odabrani predmet -> dohvati materijale
		if(tabID == 'work-hour-materials' && fetched == false) {
			fetchMaterials();
		}
	}

	$$('.tab').addEvent(default_event_type, function(ev) {
		var tabID = this.get('data-tab-id');
		switchTabs(tabID);
	});
	
	confirmButton.on('click',function(){
		switchTabs('work-hour-content');
	});


	//izostanci
	var token = jquery('#ci_csrf_token').val();
	var absent_students = jquery('#absent-students-container-modal');
	var input_students = jquery('#students');
	var class_course_select = jquery('#class_course_id');
	var no_students = jquery('#no-students');

	var getStudents = function() {
		var wd_id = jquery('#workday_id').val();
		var ccid = jquery('#class_course_id').val();
	
		var work_hour_data = {
			workday_id: wd_id,
			class_course_id: ccid,
			ci_csrf_token: token
		};
		jquery.ajax
		('/daybook/ajax_get_available_absent_students',
		{ 
			data: work_hour_data,
			method : 'POST',
			success: function(result)
			{	
				try {
					var data = JSON.parse(result);
				}
				catch(err) {
					edFlashAlert('error','Došlo je do pogreške!');
				}
				hideAbsentMessage();
				absent_students.empty();
				jquery.each(data, function(i, val){
					absent_students.append('<div class="absent-selection" data-id="'+val.id+'">'+ '<div class="round-selection">' + '<div class="red-dot hide">' + '</div>' + '</div>' + '<span>' + val.order + ' ' + val.name + '</span>' + '</div>');
				});
			},
			error: function(){
				edFlashAlert('error','Dogodila se greška prilikom dohvaćanja popisa učenika');
			}
		});
	}
	if(class_course_select.val() != '') getStudents();
	// kad se promijeni predmet, dohvati ponovno studente, resetiraj input za dohvacene
	//stavi da je fetched false za ponovni dohvat nastavnih materijala i resetiraj input za odabrane materijale
	class_course_select.change(function(e) {
		if(class_course_select.val() != '') getStudents();
		input_students.val('');
		fetched = false;
		//materials_input.val('');
	});

	absent_students.on('click','.absent-selection',function(e){
		jquery(this).toggleClass('checked');
		jquery(this).find('.red-dot').toggleClass('hide');
		updateAbsentStudents();
	});

	//azuriranje kojim ucenicima se oznacava izostanak
	var updateAbsentStudents = function() {
		var selected = jquery('.absent-selection.checked');
		var selected_students = [];

		selected.each(function(i) {
			selected_students.push(jquery(this).data('id'));
		});

		input_students.val(JSON.stringify(selected_students));
	};

	var hideAbsentMessage = function(){
		if(!no_students.hasClass('hide')) no_students.addClass('hide');
	}

	//sat odrzan ili nije odrzan
	var toggleBtn = jquery('#toggle-held');
	var heldInput = jquery('#held');
	var previousContainer = jquery('#previous-work-hour-containter');
	var noteLabel = jquery('label[for="note"]');
	var note = jquery('#note');
	var navigation = jquery('.nav-tab');
	var heldcondition = jquery('.heldcondition');
	var timetable_class_course = jquery('#timetable_class_course_id');
	
	toggleBtn.edSwitch('#held');

	toggleBtn.on('click',function(e) {
		if(heldInput.val() == 'true') {
			noteLabel.html('Nastavna jedinica');
			note.attr('data-msg','nastavnu jedinicu');
		}
		else {
			noteLabel.html('Napomena: <i class="icon-asterisk required"></i>');
			note.attr('data-msg','napomenu');
		}

		previousContainer.toggleClass('mt20 hide');
		navigation.toggleClass('hide');
		heldcondition.toggleClass('hide');
		updateClassCoursesForTeacher();
	});

	var updateClassCoursesForTeacher = function(){
		var insert_data = {
			held: heldInput.val(),
			ci_csrf_token: token
		};
		jquery.ajax
		('/daybook/get_class_courses_for_insert_work_hour',
		{ 
			data: insert_data,
			method : 'POST',
			success: function(result)
			{	
				try {
					var data = JSON.parse(result);
				}
				catch(err) {
					edFlashAlert('error','Došlo je do pogreške!');
				}

				var selectedClassCourse = class_course_select.val();

				class_course_select.empty();
				jquery.each(data.class_courses, function(i, val){
					class_course_select.append('<option value="'+val.id+'">'+ val.name +'</option>');
				});

				if(selectedClassCourse != '') {
					class_course_select.children('option[value="'+selectedClassCourse+'"]').prop('selected', true);
				}
				else {
					selectTimeTableClassCourse();
				}				
			},
			error: function(){
				edFlashAlert('error','Dogodila se greška prilikom dohvaćanja predmeta');
			}
		});
	}

	var selectTimeTableClassCourse = function(){
		if(timetable_class_course){
			jquery('option[value="'+timetable_class_course.val()+'"]').attr('selected','selected');
		}
	}
});