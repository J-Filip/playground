jquery(document).ready(function(){
	var token = jquery('#ci_csrf_token').val();
	var heldInput = jquery('#held');
	var previousContainer = jquery('#previous-work-hour-containter');
	var noteLabel = jquery('label[for="note"]');
	var note = jquery('#note');
	var navigation = jquery('.nav-tab');
    var heldcondition = jquery('.heldcondition');
	var class_course_select = jquery('#class_course_id');
	var timetable_class_course = jquery('#timetable_class_course_id');
    //ukloni i postavi potrebne vrijednosti za sat nije odrzan
    heldInput.val('false');
    previousContainer.remove();
    noteLabel.html('Napomena: <i class="icon-asterisk required"></i>');
    note.attr('data-msg','napomenu');
    navigation.remove();
    heldcondition.toggleClass('hide');
    //dohvati predmete sve koje korisnik moze unijeti da nije odrzan
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
				class_course_select.empty();
				jquery.each(data.class_courses, function(i, val){
					class_course_select.append('<option value="'+val.id+'">'+ val.name +'</option>');
				});
				selectTimeTableClassCourse();
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

	updateClassCoursesForTeacher();
    //onemoguci toggle i postavi ga na FALSE state
    jquery('.toggle').addClass('disabled');

    jquery('#heldToggle').on('click',function(e){
        e.preventDefault();
    })
});