$$('.pm').addEvent('click:relay(a)', function(event,target){
	event.preventDefault();

	var request_url=target.getProperty('href');
	var parentElement = target.getParent();
	var oldButton=parentElement.getProperty('html');
	parentElement.empty();
	var r = new Request.JSON({
		url: request_url,
		onSuccess: function (response) {
			if (response.error === false){
				var a;
				if (response.status === 'removed') {
					a = new Element('a.add-pm', {html:'-', href:'/minutes/add_attendance/'+response.student_class_id+'/'+response.parent_meeting_id});
				}
				if (response.status === 'added') {
					a = new Element('a.remove-pm', {html:'+', href:'/minutes/remove_attendance/'+response.parent_meeting_attendee_id});
				}
				$(parentElement).adopt(a);
			}
			else {
				edAlert(_('Došlo je do greške.\nPodatak nije izmjenjen!'));
				parentElement.setProperty('html', oldButton);
			}
		}
	}).get();
});

jquery('.pm-single-add').edEditMenu('#group1');
jquery('.pm-add').edEditMenu('#group2');

new edConfirm('.delete-pm', _('Želite li obrisati roditeljski sastanak s datumom') + ' confirm-msg?');
