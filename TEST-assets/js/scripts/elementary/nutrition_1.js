var myEvent = function(event,target){
	event.preventDefault();

	var request_url = target.getProperty('href');
	var parentElement = target.getParent();
	var trParent = target.getParent().getParent();

	if(trParent.getProperty('inactive') === 'true') {
		return;
	}

	var oldButton = parentElement.getProperty('html');

	parentElement.empty();

	var r = new Request.JSON({
		url: request_url,
		onSuccess: function (response) {
			if (response.error === false){
				if(target.hasClass('create-n')){
					parentElement.erase('colspan');
					new Element('td.n')
						.adopt(
							new Element('a.remove-n', {html:'+', href:'/elementary/change_nutrition/'+response.student_class_id+'/'+response.month+'/false/true'}))
						.inject(parentElement,'after');
					$(parentElement)
						.adopt(
							new Element('a.remove-n', {html:'+', href:'/elementary/change_nutrition/'+response.student_class_id+'/'+response.month+'/true/false'}));
					$$('.n').removeEvent('click:relay(a)', myEvent);
					$$('.n').addEvent('click:relay(a)', myEvent);
				}else{
					var a;
					if(target.hasClass('remove-n')){
						a = new Element(response.css, {html:response.sign, href:'/elementary/change_nutrition/'+response.student_class_id+'/'+response.month+'/'+response.snack+'/'+response.lunch});
					}
					else {
						a = new Element(response.css, {html:response.sign, href:'/elementary/change_nutrition/'+response.student_class_id+'/'+response.month+'/'+response.snack+'/'+response.lunch});
					}
					$(parentElement).adopt(a);
				}
			}
			else {
				edAlert(_('Došlo je do greške.\nPodatak nije izmjenjen!'));
				parentElement.setProperty('html', oldButton);
			}
		},
		onFailure: function(response) {
			edAlert(_('Došlo je do greške - nemate pravo izmjene podataka'));
			parentElement.set('html', oldButton.trim());
		}
	}).get();
};

$$('.n').addEvent('click:relay(a)', myEvent);
