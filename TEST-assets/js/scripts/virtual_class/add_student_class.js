$$(".virtual_class").addEvent('click', function(e) {
	$$('.virtual_class').removeClass('selected');
	this.addClass('selected');
	fetch_links();
});

var fetch_links = function() {
	var class_id = $$('.virtual_class.selected').get('id');
	//var request = new Request.JSON({
	//	onSuccess: function(responseText) { generate_links(responseText); },
	//	onFailure: function(xhr) { generate_links(); },
	//	url: '/virtual_class/get_available_students/'+class_id}).post();

	// Dummy data
	var students1 = ([
		{"student_id":2,"name":"Pero Peric","active": null},
		{"student_id":4,"name":"Mirko Slavko","active":"true"},
		{"student_id":6,"name":"Ivan Ivankovic","active":"true"}]);
	var students2 = ([
		{"student_id":2,"name":"Ucenik 1","active": null},
		{"student_id":4,"name":"Ucenik 2","active":"true"},
		{"student_id":6,"name":"Ucenik 3","active":"true"}]);
	var students3 = ([
		{"student_id":2,"name":"Pero","active": null},
		{"student_id":4,"name":"Mirko","active":"true"},
		{"student_id":6,"name":"Ivan","active":"true"}]);

	var output;
	var index = parseInt(class_id, 10);

	switch(index) 
	{
		case 1: output = students1;
			break;
		case 2: output = students2;
			break;
		case 3: output = students3;
			break;
		default: break;
	}
	//End dummy data

	generate_links(output);
};

var generate_links = function(json) {
	$('student_list').empty();
	var count = 0;
	for(var index in json) {
			if(typeof(json[index]) !== 'function') {
				var row = new Element('a', { 'class': 'virtual-student ed-row touch-row', html: json[index].name, 'id': json[index].student_id });

				if(json[index].active) {
					row.addClass('active');
				} else {
					row.addClass('inactive');
				}

				$('student_list').grab(row);
				count++;
			}
	}

	if(count === 0) {
		$('student_list').grab(new Element('p',{html:'<b>' + _('U ovom virtualnom razredu nema učenika') + '</b>'}));
	}

	$$('.virtual_class.selected .student-count').set('html',count);

	$$('.virtual-student').addEvent('click',function(e) {
		if(this.hasClass('active')) {
			this.removeClass('active');
			this.addClass('inactive');
		} else {
			this.removeClass('inactive');
			this.addClass('active');
		}
		//update_students();
	});
};

var update_students = function() {
	//var ids = JSON.stringify($$('.student.active').get('id'));
	//var class_id = $$('.virtual_class.selected').get('id');
	//var token = $('ci_csrf_token').get('value');
	//var request = new Request({
	//	onSuccess: function(){ fetch_links(); },
	//	url: '/virtual_class/add_student_action/'}).post('class_id='+class_id+'&ids='+ids+'&ci_csrf_token='+token);

	fetch_links();
};
