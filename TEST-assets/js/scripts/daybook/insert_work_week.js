//varijable za toggle nastavni/nenastavni tjedan
var toggleBtn = jquery('#toggle-work-week-off');
var workweekoffInput = jquery('#work_week_off');

//varijable za odabir radnih dana
var datepicker = jquery(".datepicker_dashboard");
var input_dates = jquery('#dates');
var selectall = jquery('#selectall');
var named_days = ['pon','uto','sri','čet','pet','sub'];
var workdays = jquery("#workdays");
var workweek_title = jquery('#workweek-title');
var description_box = jquery('.nonteaching-description');
var description = jquery('.description');
var main_div = jquery('#main-week-info');

toggleBtn.edSwitch('#work_week_off');

toggleBtn.on('click',function(e){
	switch(workweekoffInput.val()) {
		case 'false':
					$('shift_id').setProperty('disabled','disabled');
					$('duty_1_student_class_id').setProperty('disabled','disabled');
					$('duty_2_student_class_id').setProperty('disabled','disabled');
					$('work_week_off_description').erase('disabled');
					description.removeClass('op30 hide');
					main_div.addClass('op30');
					description_box.addClass('hide');

					jquery('div.workday-selection').removeClass('checked');
					updateDates();
					input_dates.removeAttr('data-required');

					break;
		case 'true':
					$('shift_id').removeProperty('disabled');
					$('duty_1_student_class_id').removeProperty('disabled');
					$('duty_2_student_class_id').removeProperty('disabled');
					$('work_week_off_description').set('disabled','disabled');
					description.addClass('op30 hide');
					input_dates.attr('data-required','true')
					main_div.removeClass('op30');
					description_box.removeClass('hide');
					break;
		default:	break;
	}
});
//nakon odabira datuma se poziva metoda koja provjerava jel tjedan s tim datumom postoji
datepicker.on("click","td",function(e){
	var picker_date = {
		date: jquery("#start_date").val(),
		ci_csrf_token: jquery("#ci_csrf_token").val()
	};
	workdays.empty();
	input_dates.val('');
	workweek_title.empty();
	selectall.addClass('hide');
	jquery.ajax
	('/daybook/check_work_week',
	{ 
        data: picker_date,
		method : 'POST',
        success: function(result)
        {	
			try {
				var data = JSON.parse(result);
			}
			catch(err) {
				edFlashAlert('error','Došlo je do pogreške pri dohvaćanju podataka!');
			}
			if (workdays.hasClass('hide')) {
				workdays.removeClass('hide').addClass('mb25');
			}
			if (data.exists){
				workdays.append('<span class="fs140 bold">' + "Navedeni tjedan već postoji!" + '</span>');
			}
			else{	
				jquery.each(data.days, function(i, val) {
					var shownDate = new Date(val);
  					var formattedDate = jquery.datepicker.formatDate('dd.mm.y.', shownDate);

					workdays
					.append('<div class="workday-selection" data-date="' + val + '">'
					+ '<span class="bold">' + named_days[i] + '</span>' + ' ' + formattedDate
						+ '<div class="t-center mt10" id="teaching-day" data-date="'+ val +'">'
							+ '<i class="icon-cancel smallfont"></i>' + '<span class="smallfont">' + 'nenastavni' + '</span>' 
						+ '</div>'
					+ '</div>');
				});
				workweek_title.html(data.range);			
				if (selectall.hasClass('hide')) selectall.removeClass('hide');
			}
		},
		error: function(){
			edFlashAlert('error','Došlo je do pogreške pri dohvaćanju podataka!');
		}
	});
});

//oznaci radne dane od ponedjeljka do petka
selectall.on("click",function(e){
	if(workweekoffInput.val() != 't'){
		e.target.toggleClass('checked');
		jquery('.workday-selection').each(function(i){
			if (e.target.hasClass('checked') && i != 5 ){
				jquery(this).addClass('checked');
			} 
			else if (!e.target.hasClass('checked') && i != 5) jquery(this).removeClass('checked');
		});
		updateDates();
	}
});

//oznacavanje pojedinog radnog dana
workdays.on('click','div.workday-selection',function(e){
	if(workweekoffInput.val() != 't'){
		e.target.toggleClass('checked');
		updateDates();
	}
});

//oznacavanje nenastavnog dana
workdays.on('click','div#teaching-day',function(e){
	if(workweekoffInput.val() != 't'){
		var date = jquery(this).data('date');
		var wd_note_wrap = jquery('div.workday_note_wrap');
		var icon = jquery(this).children('i');

		if (icon.hasClass('icon-cancel')) {
			icon.removeClass('icon-cancel').addClass('icon-ok');
			if (!wd_note_wrap.length > 0){
				description_box.append(
					'<div class="workday_note_wrap">'
						+'<label for="workday_note" id="woffd_label">' + 'Opis nenastavnog dana: </label>'
						+'<textarea name="workday_note" class="workday_note"></textarea>'
					+'</div>');
			}

		}
		else{
			jquery(this).children('i').removeClass('icon-ok').addClass('icon-cancel');
			if(jquery('.icon-ok').length == 0) wd_note_wrap.remove();
		}
		updateDates();
	}
});

//pisanje notea za nenastavni dan
description_box.on('focusout','.workday_note',function(e){
	updateDates();
});

//azuriranje koji datumi su oznaceni
var updateDates = function() {
	var selected = jquery('.workday-selection.checked');
	var selected_dates = [];

	selected.each(function(i) {
		var wd_date = jquery(this).data('date');
		if (jquery(this).find('i').hasClass('icon-cancel')){
			selected_dates.push({
				date: wd_date,
				nonteaching: false,
				note: false
			});
		}
		else{
			selected_dates.push({
				date: wd_date,
				nonteaching: true,
				note: jquery('textarea.workday_note').val()				
			});			
		}
	});

	input_dates.val(JSON.stringify(selected_dates));
};