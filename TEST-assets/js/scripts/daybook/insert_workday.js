var toggleBtn = jquery('#toggle-workday-off');
var workweekoffInput = jquery('#workday_off');
var selectall = jquery('#selectall');
var workdays = jquery(".workday-selection");
var input_dates = jquery('#dates');

toggleBtn.edSwitch('#workday_off');

toggleBtn.on('click',function(e){
	switch(workweekoffInput.val()) {
		case 'false':
					$('workday_off_description').erase('disabled');
					$$('.description').removeClass('op30');
					break;
		case 'true':
					$('workday_off_description').set('disabled','disabled');
					$$('.description').addClass('op30');
					break;
		default:	break;
	}
});

//oznaci radne dane od ponedjeljka do petka
selectall.on("click",function(e){
	e.target.toggleClass('checked');
	jquery('.workday-selection').each(function(i){
		if (e.target.hasClass('checked')){
			jquery(this).addClass('checked');
		} 
		else if (!e.target.hasClass('checked')) jquery(this).removeClass('checked');
	});
	updateDates();
});

//oznacavanje pojedinog radnog dana
workdays.on('click',function(e){
	jquery(this).toggleClass('checked');
	updateDates();
});

//azuriranje koji datumi su oznaceni
var updateDates = function() {
	var selected = jquery('.workday-selection.checked');
	var selected_dates = [];

	selected.each(function(i) {
		var wd_date = jquery(this).data('date');

		selected_dates.push({
			workday_date : wd_date
		});
	});

	input_dates.val(JSON.stringify(selected_dates));
};
