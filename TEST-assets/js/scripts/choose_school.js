jquery(document).ready(function() {
	var schoolyear_id = jquery("#content").data("current-schoolyear");
	var school = jquery('.choose-school');
	var header_change = jquery('#header_change');

	//dodajemo razrede grupirane po class_levelu u selektiranu skolu
	var appendClasses = function(data,school_id,schoolyear_id){
		var chosen_school = jquery('div[data-school="'+school_id+'"]');

		jquery.each(data.school_classes, function (index, level) {
			if (!schoolyear_id){
			chosen_school.append('<li data-school-class="'+ index +'"class="school-level main">'+'<span class="pl5">' + index + '</span> </li>');
			}
			else{
				chosen_school.find('ul[data-schoolyear="'+schoolyear_id+'"]').append('<li data-school-class="'+ index +'"class="school-level main">'+'<span class="pl5">' + index + '</span> </li>');
			}
			var school_level = jquery('li[data-school-class="'+index+'"]');
			jquery.each(level, function (index, school_class) {
				var sc_level = (school_class.class_type_id ? '<span class="br">' + school_class.class_type_id + '.' +'</span>' :'');

				school_level.append('<a class="ed-row touch-row hide" href="/settings/set_school_class/'+school_class.school_class_id+'">' +
				sc_level + school_class.section_name + '</a>');		
			}); 
		});

		if (data.individual){
			chosen_school.append('<li class="individual main"><span class="pl5">'+ "Pojedinačna nastava" +'</span>'+'<ul class="individual-courses"></ul></li>');	
			var chose_individual = jquery('.individual');		
				jquery.each(data.individual, function (index, level) {
					chose_individual.append('<li data-individual-student="'+ index +'"class="individual-course main hide">'+'<span class="pl5">' + index + '</span> </li>');
					var individual = jquery('li[data-individual-student="'+ index +'"]');
					jquery.each(level, function (index, individual_student) {
							individual.append('<a class="ed-row touch-row hide" href="/music_school/show_grade_book/'+individual_student.student_course_id+'">' 
								+ individual_student.student_name + ' ' + individual_student.student_last_name +'</a>');		
				}); 		
			});
		}

		if (!schoolyear_id){
			chosen_school.append('<li class="choose-year main"><span class="bold pl5">'+ "Odabir razreda prošle godine" +'</span>'+'<ul class="past-years"></ul></li>');
			var choose_year = jquery('.past-years');
			jquery.each(data.past_schoolyear, function (i, year) {	
				choose_year.append('<li data-schoolyear="'+ year.schoolyear_id +'" class="past-year hide main"> <span class="pl5">'
					+ year.schoolyear+'</span><ul data-schoolyear="'+ year.schoolyear_id +'"></ul></li>');
			});	
		}	
	}
	//dohvacamo ajaxom sve razrede, po defaultu zadnja skolska godina (id u contentu)
	var getClasses = function(schoolyear_id,school_id,current){
		jquery.ajax('/Settings/choose_school_class/'+schoolyear_id+'/'+school_id,
		{
			type: 'GET',
			success: function (result){
				try{
					var data = JSON.parse(result); 
				} 
				catch(err){
					alert('Došlo je do pogreške pri dohvaćanju podataka!');
				}			
				if ( current == true) {appendClasses (data,school_id);}
				else {
					appendClasses(data,school_id,schoolyear_id);
					if(header_change) {revealPastYearClasses();}
				}
			},
			error: function (data) {
				alert('Došlo je do pogreške pri dohvaćanju podataka!');
			}		
		});
	}

	//menu se skuplja ako se klikne negdje po documentu
	jquery(document).on("click touchend",function (e) {
		if (!school.is(e.target) && school.has(e.target).length === 0){
			school.children('li').remove();
			school.children('div.ed-row').removeClass('active');
		}
	});

	school.on("click", ".school-level", function(e){
		jquery(this).children('a').toggleClass('hide');
		e.stopPropagation();
	});

	school.on("click", ".choose-year", function(e){
		jquery(this).toggleClass('active').find('li').toggleClass('hide');
		e.stopPropagation();
	});

	school.on("click", ".individual", function(e){
		jquery(this).find('li').toggleClass('hide');
		e.stopPropagation();
		if (jquery(this).hasClass('active')){
			jquery(this).removeClass('active');
			jquery(this).children('ul').empty();
		}
		else{
			jquery(this).addClass('active');
		}
	});

	school.on("click", ".individual-course", function(e){
		jquery(this).children('a').toggleClass('hide');
		e.stopPropagation();
	});

	school.on('click','.past-year',function(e){
		e.stopPropagation();
		if (jquery(this).hasClass('active')){
			jquery(this).removeClass('active');
			jquery(this).children('ul').empty();
		}
		else{
			jquery(this).addClass('active');
			var schoolyear_id = jquery(this).data('schoolyear');
			var school_id = jquery(this).parents('div.choose-school').data('school');		
			getClasses(schoolyear_id,school_id,false);
		}
	});

	school.on("click", function(e) {
		if (e.target.hasClass('active')){
			e.target.removeClass('active');
			jquery(this).children('li').remove();
		}
		else {	
			e.target.addClass('active');
			var school_id = jquery(this).data("school");
			getClasses(schoolyear_id,school_id,true);
		}
	});
	//da se ne propagira event do school-levela
	school.on('click','.school-level > .ed-row',function(e){
		e.stopPropagation();
	});

	//ako odabere skolsku godinu u headeru, odmah mu prikazujemo to
	if (header_change.length){
		var schoolID = header_change.data('school-id');
		var schoolyearID = header_change.data('schoolyear-id')
		if(schoolyear_id != schoolyearID){
			var selected_school = jquery('div[data-school="'+schoolID+'"]');

			var revealPastYearClasses = function(){
				selected_school.find('.past-year').removeClass('hide');
				selected_school.find('li[data-schoolyear="'+schoolyearID+'"]').addClass('active');
			}
	
			getClasses(schoolyear_id,schoolID,true);
			getClasses(schoolyearID,schoolID,false);
	
			selected_school.children('div.ed-row').addClass('active');
		}
	}
});
