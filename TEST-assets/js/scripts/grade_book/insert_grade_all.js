var grade_copy = jquery('#main_grade');

$('copy_bttn').addEvent('click', function() {
	$$('.note').each(function(el){
		el.set('value', $('note_main').get('value'));
	});
	if(grade_copy.val() || grade_copy.val() == ''){
		$$('.grade_select').each(function(el){
			el.set('value', grade_copy.val());
		});
	}
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
