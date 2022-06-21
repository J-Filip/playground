var token = $('ci_csrf_token').get('value');

var addHandlers = function() {
	var ms_students = new edMultiSelect({ elements: $$('.ed-row.touch-row'), input: $$('#students'), keys: ['id'] });

	$$('.ed-row.touch-row').addEvent(default_event_type, function(ev) {
		$('selected_count').set('text', ms_students.options.count);
	});
};

var getStudents = function() {
	var whid = $('work_hour_id').getSelected().get('value');
	var ccid = $('work_hour_id').getSelected().get('ccid');

	var request = new Request.JSON({
			onSuccess: function(response) {
				$('absent-students-container').empty();
				for(var index in response) {
					if(typeof(response[index]) !== 'function') {
						var row = new Element('div', { 'class': 'ed-row touch-row inactive', html: response[index].name, 'id': response[index].id });
						row.grab(new Element('i', {'class': 'icon-cancel right'}));
						$('absent-students-container').grab(row);
					}
				}
				addHandlers();
			},
			onFailure: function(xhr) { edAlert(_('Dogodila se greška prilikom dohvaćanja popisa učenika'));},
			onComplete: function(xhr) { $('selected_count').set('text', '0'); },
			url: '/daybook/get_available_absent_students/'+whid+'/'+ccid}).post('ci_csrf_token=' + token);
};

getStudents();

$('work_hour_id').addEvent('change', function(e) {
	getStudents();
	$('students').value = '';
});
