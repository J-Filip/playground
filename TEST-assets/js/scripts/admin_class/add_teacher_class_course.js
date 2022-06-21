var elementary = $('elementary').get('value') !== '';
var classmaster_lower = false;
var qualified_for_course = false;
var picker = jquery('.datepicker_dashboard');

var newEntry = $('user_id');

$('delete_date_from').addEvent(default_event_type, function(ev) {
	$('datepicker_date_from').set('value', '');
	$('date_from').set('value', '');
});

$('delete_date_to').addEvent(default_event_type, function(ev) {
	$('datepicker_date_to').set('value', '');
	$('date_to').set('value', '');
});

$('form').addEvent('submit', function(ev) {
	$$('#substitute').set('disabled', '');
	$$('#qualified_substitute').set('disabled', '');
});

var preselect = function(qualified) {
	if(qualified) {
		$$('#sub_false').set('selected', 'selected');
		$('sub_qualified').set('selected', 'selected');
	}
	else {
		$$('#sub_true').set('selected', 'selected');
		$('sub_unqualified').set('selected', 'selected');
	}
}

//Odabir nastavnika
if(newEntry) {
	$('user_id').addEvent('change', function(ev) {
		qualified_for_course = this.getSelected().get('data-teaches') == "true";
		if(!qualified_for_course) {
			edAlert(_('Odabrani nastavnik ne predaje predmet') + '<br><b>' + $('course_name').get('text') + '</b><br>' + _('te se smatra nestručnom zamjenom!'));
			preselect(false);
			$('qs_container').removeClass('hide');
		}
		else {
			preselect(true);
		}
	});
}
else {
	qualified_for_course = $('course_qualified').get('value') !== '0';
	if(elementary && $('substitute').get('value') == 't') $('qs_container').removeClass('hide');
}

$('substitute').addEvent('change', function(ev) {
	if(elementary && this.get('value') == 't') {
		$('qs_container').removeClass('hide');
	}
	else {
		$('sub_qualified').set('selected', 'selected');
		$('qs_container').addClass('hide');
	}
});

picker.on('click','td', function (e) {
	var minDate = new Date($('date_from').get('value'));
	var maxDate = new Date($('date_to').get('value'));
	if (minDate > maxDate) {
		setTimeout(function () {
			edAlert(_('Datum završetka mora biti nakon datuma početka. Molimo odaberite ispravan datum završetka.'));
			$('datepicker_date_to').set('value', '');
			$('date_to').set('value', '');
			$('datepicker_date_from').blur();
			$('datepicker_date_to').blur();
		}, 300);
	}
});