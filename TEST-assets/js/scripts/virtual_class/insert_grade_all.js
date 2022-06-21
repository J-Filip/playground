$('copy_bttn').addEvent('click', function() {
	$$('.note').each(function(el){
		el.set('value', $('note_main').get('value'));
	});
});

jquery('#toggle-important').edSwitch('#important');

window.addEvent('domready', function() {
	picker.addEvent('close', function(ev) {
		var date = new Date().parse($('grade_date').get('value'));
		if(date.getDay() === 0) {
			setTimeout(function() {
				edAlert(_('Nije moguće unijeti ocjenu na nenastavni dan!'));
				$('datepicker_grade_date').set('value', new Date().format('%d. %m. %Y.'));
			}, 200);
		}
	});
});

var class_course_select = jquery('#class_course');
var error_msg			= jquery('#errormsg');
var choose_div 			= jquery('#activity_div');
var chosen_div 			= jquery('#chosenactivities');
var activities_select	= jquery('#class_course_activities');
var activity_input		= jquery('#class_course_activity_id');
var activity_div		= jquery('#activity_div');
var required_icons		= jquery('i.icon-asterisk');
var classOptionsCount	= class_course_select.children('option').length;

var showNoActivities = function(){
	error_msg.removeClass('hide');
}

var hideNoActivities = function(){
	error_msg.addClass('hide');
}

var showActivitiesOptions = function(activities){
	jquery.each(activities, function(i, activity){
		activities_select.append('<option value="'+activity.id+'">'+activity.name+'</option>');
	});
}

var emptyActivitySelect = function(){
	activities_select.empty();
	activities_select.append('<option value="">--odaberite element vrednovanja--</option>');
}

var appendClassCourseActivity = function(cca){
	chosen_div.append('<div class="ed-selectedbox mr5" data-name="'+cca.school_class+'" data-ccid="'+cca.class_course_id+'" data-ccaid="'+cca.cca_id+'">'+cca.school_class+' - '+cca.activity_name+'<i class="icon-cancel ml5"></i></div>');
}

var hideChooseDiv = function(){
	choose_div.addClass('hide');
}

var showChooseDiv = function(){
	choose_div.removeClass('hide');
}

var removeRequired = function(){
	class_course_select.removeAttr('data-required');
	activities_select.removeAttr('data-required');
	required_icons.addClass('hide');
}

var addRequired = function(){
	class_course_select.attr('data-required','true');
	activities_select.attr('data-required','true');
	required_icons.removeClass('hide');
}

var createClassSelect = function(razred){
	class_course_select.append('<option value="'+razred.class_course_id+'">'+razred.name+'</option>');
}

var getActivities = function(cc_id){
	jquery.ajax
	('/virtual_class/ajaxGetClassCourseActivities/'+ cc_id,
	{ 
		method : 'GET',
		success: function(result)
		{	
			try {
				var data = JSON.parse(result);
			}
			catch(err) {
				edFlashAlert('error','Došlo je do pogreške!');
			}	
			
			if (data.status == false){
				showNoActivities();
			}
			else{
				hideNoActivities();
				emptyActivitySelect();
				showActivitiesOptions(data.activities);
			}
		},
		error: function(){
			edFlashAlert('error','Dogodila se greška prilikom dohvata elemenata ocjenjivanja');
		}
	});
}

var updateActivities = function(){
	var selected = jquery('.ed-selectedbox');
	var selected_students = [];

	selected.each(function(i) {
		selected_students.push({
			class_course_id 		 : jquery(this).data('ccid'),
			class_course_activity_id : jquery(this).data('ccaid')
		});
	});
	
	activity_input.val(JSON.stringify(selected_students));
}


class_course_select.change(function(){
	ccid = jquery(this).val();
	getActivities(ccid);
});

activities_select.change(function(){
	if(!class_course_select.val()) return;
	cca = {
		class_course_id : class_course_select.val(),
		activity_name	: jquery(this).children('option:selected').text().trim(),
		cca_id          : jquery(this).val(),
		school_class	: class_course_select.children('option:selected').text().trim()
	}
	appendClassCourseActivity(cca);
	removeRequired();
	class_course_select.children('option:selected').remove();
	if(class_course_select.children('option').length == 1){
		hideChooseDiv();
	}
	updateActivities();
});

chosen_div.on('click','.icon-cancel',function(e){
	razred = {
		class_course_id : jquery(this).parent().data('ccid'),
		name			: jquery(this).parent().data('name')
	}
	createClassSelect(razred);
	jquery(this).parent().remove();
	showChooseDiv();
	if(class_course_select.children('option').length == classOptionsCount){
		addRequired();
	}
});