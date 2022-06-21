var clear_msg = function(id) {
	$$('.error_' + id).destroy();
	$$('.opis_' + id).destroy();
};

$$('.oib').addEvent('change', function(e){
	var currentEl = this;
	var id = currentEl.get('id');
	if (this.value.test(/^[0-9]{11}$/)) {

		var r = new Request.JSON({
				url:'/admin_class/lookup_student_by_oib/'+this.value,
				onSuccess: function(user) {
					clear_msg(id);
					new Element('span', {"class": 'w50 opis_' + id, html:user.name + ' ' + user.last_name}).inject(currentEl, 'after');
					$$('.error_' + id).destroy();
				},
				onFailure: function () {
					clear_msg(id);
					new Element('span', {"class": 'opis w50 error_' + id, html: _('Učenik sa upisanim OIB-om ne postoji')}).inject(currentEl, 'after');
				}
			}).get();
	}
	else {
		clear_msg(id);
		new Element('span', {"class": 'opis error_' + id, html: _('Neispravan OIB')}).inject(currentEl, 'after');
	}
});
