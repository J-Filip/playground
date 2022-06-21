var lastWorkHour = new Class({
	Implements: [Events, Options],
	options: {},
	initialize: function() {
		this.options.cc_id = $('cc_id').value;
		this.options.gid   = $('group').value;
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

	updateLastHour: function(){
		var request_url='/virtual_class/last_work_hour/'+this.options.cc_id+'/'+this.options.gid;
		new Request.JSON({
			url: request_url,
			onSuccess: function (response) {
				if (response.error===false){
					var parts = response.date.split(/[- :]/),
					date = new Date(parts[0], parts[1]-1, parts[2]);

					var html = '[' +response.counter+ '] '+response.class_course;

					html += date.format('%d. %m. %Y.');

					if (response.group) {
						html += ' - grupa: ' + response.group;
					}

					html += response.note;

					$('previous-work-hour').setProperty('html', html);

				}
				else {
					$('previous-work-hour').setProperty('html', _('ne postoji podatak o prethodno upisanom satu'));
				}
			}
		}).get();
	}
});

new lastWorkHour();

//izostanci
jquery(document).ready(function(){	
	var datepicker = jquery(".datepicker_dashboard");
	var token = jquery('#ci_csrf_token').val();
	var absent_students = jquery('#absent-students-container-modal');
	var input_students = jquery('#students');
	var messagebox = jquery('.info-message');

	var fetchedStudents = false;

	var getStudents = function() {
		var ccid = jquery('#cc_id').val();
		var date = jquery('#date').val();
		absent_students.empty();
		messagebox.removeClass('hide');

		var work_hour_data = {
			selected_date : date,
			class_course_id: ccid,
			ci_csrf_token: token
		};
		jquery.ajax('/virtual_class/ajax_get_available_absent_students',
		{ 
			data: work_hour_data,
			method : 'POST',
			success: function(result)
			{	
				try {
					var data = JSON.parse(result);
				}
				catch(err) {
					alert('Došlo je do pogreške!');
				}

				if (!messagebox.hasClass('hide')) messagebox.addClass('hide');
				jquery.each(data, function(i, val){
					absent_students.append('<div class="absent-selection" data-id="'+val.id+'">'+ '<div class="round-selection">' + '<div class="red-dot hide">' + '</div>' + '</div>' + '<span>' + val.name + '</span>' + '</div>');
				});
				fetchedStudents = true;
			},
			error: function(){
				alert('Dogodila se greška prilikom dohvaćanja popisa učenika');
			}
		});
	}

	absent_students.on('click','.absent-selection',function(e){
		jquery(this).toggleClass('checked');
		jquery(this).find('.red-dot').toggleClass('hide');
		updateAbsentStudents();
	});

	datepicker.on("click","td",function(e){
		//getStudents();
		input_students.val('');
	});

	//azuriranje kojim ucenicima se oznacava izostanak
	var updateAbsentStudents = function() {
		var selected = jquery('.absent-selection.checked');
		var selected_students = [];

		selected.each(function(i) {
			var student = {id : jquery(this).data('id') };
			selected_students.push(student);
		});

		input_students.val(JSON.stringify(selected_students));
	};

	//switchanje tabova
	var switchTabs = function(tabID) {
		$$('.tab').removeClass('active');
		$$('[data-tab-id="' + tabID + '"]').addClass('active');

		$$('.tab-content').addClass('hide');
		$(tabID).removeClass('hide');

		if(tabID === 'work-hour-absents' && !fetchedStudents) {
			getStudents();
		}
	}

	$$('.tab').addEvent(default_event_type, function(ev) {
		var tabID = this.get('data-tab-id');
		switchTabs(tabID);
	});
});