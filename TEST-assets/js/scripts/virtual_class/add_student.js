var token = $('ci_csrf_token').get('value');

$$(".virtual_class").addEvent('click', function(e) {
	$$('.virtual_class').removeClass('selected');
	this.addClass('selected');
	fetch_links();
});

var fetch_links = function() {
	var class_id = $$('.virtual_class.selected').get('id');
	var request = new Request.JSON({
		onSuccess: function(responseText) { generate_links(responseText); },
		onFailure: function(xhr) { generate_links(); },
		url: '/virtual_class/get_available_students/'+class_id}).post('ci_csrf_token=' + token);
};

var generate_links = function(json) {
	$('student_list').empty();
	var count = 0;
	for(var index in json) {
		if(typeof(json[index]) !== 'function') {
			var item_class = json[index].semester_active ? 'virtual-student ed-row touch-row' : 'ed-row touch-row inactive';

			var row = new Element('a', { 'class': item_class, html: json[index].name, 'id': json[index].student_id });
			if(json[index].active) {
				row.addClass('active');
				row.grab(new Element('i', {'class': 'icon-ok delete-course green right'}));
			} else {
				row.addClass('inactive');
				row.grab(new Element('i', {'class': 'icon-cancel delete-course grey right'}));
			}

			if(!json[index].virtual_semester_active && json[index].semester_active) {
				row.addClass('inactive');
				row.set('text', row.get('text') + ' ' + _('(ispisan iz grupe)'));
				row.grab(new Element('i', {'class': 'icon-cancel delete-course grey right'}));
			}

			if(!json[index].semester_active) {
				row.set('text', row.get('text') + ' ' + _('(ispisan iz razreda)'));
				row.grab(new Element('i', {'class': 'icon-cancel delete-course grey right'}));
			}

			$('student_list').grab(row);
			count++;
		}
	}

	if(count === 0) {
		$('student_list').grab(new Element('p',{html:'<b>' + _('U ovom razredu nema učenika koji slušaju odabrani predmet') +'</b>'}));
	}

	$$('.virtual-student').addEvent('click',function(e) {
		if(this.hasClass('active')) {
			this.removeClass('active');
			this.addClass('inactive');
		} else {
			this.removeClass('inactive');
			this.addClass('active');
		}
		update_students(this.get('id'));
	});

	$$('.deactivate').addEvent('click', function(e) {
		new DOMEvent(e).stop();
		deactivate_students(this.getParent().get('id'));
	});
};

var update_students = function(id) {
	var token = $('ci_csrf_token').get('value');
	var request = new Request({
		onSuccess: function(response){
			fetch_links();
			$('msg').set('text','');
			if(!response) {
				$('msg').set('text',_('Učenik ispisan iz kombinirane grupe - nije ga moguće potpuno ukloniti jer postoje povezani zapisi!'));
				setTimeout(function() {
					$('msg').set('text','');
				}, 5000);
			}
		},
		url: '/virtual_class/add_student_action/'}).post('student_class_id='+id+'&ci_csrf_token='+token);
};

var deactivate_students = function(id) {
	var token = $('ci_csrf_token').get('value');
	var request = new Request.JSON({
		onSuccess: function(response) {
		},
		url: '/virtual_class/ajax_deactivate_student'}).post('student_class_id='+id+'&ci_csrf_token='+token);
};
