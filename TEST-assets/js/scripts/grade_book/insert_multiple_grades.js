$$('.date-picker').addEvent('change', function(){
	var date = this.get('value');
	var ci_csrf = $('ci_csrf_token').get('value');
	var error = new Element('div.error-msg');
	error.set('text', _('Datum nije unutar školske godine.'));
	var this_date = this;
	var req = new Request({
		method: 'post',
		url: '/grade_book/check_semester_date',
		data: 'date='+date+'&ci_csrf_token='+ci_csrf,
		onComplete: function(response) {
			var data;
			try{
				data = JSON.parse(response);
			}
			catch (err) {
				data = null;
			}

			if (data !== null){
				if(!data.success){
					if(this_date.getParent().getChildren('.error-msg').length === 0){
						this_date.getParent().grab(error);
					}
				}else{
					if(this_date.getParent().getChildren('.error-msg')[0]){
						this_date.getParent().getChildren('.error-msg')[0].destroy();
					}
				}
			}
		}
	}).send();
});
