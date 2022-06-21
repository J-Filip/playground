jquery('.edit-row').edEditMenu('#group1');
new edConfirm('.delete', _('Želite li obrisati grupu?'));


var list = jquery('#work-hour-groups');

var collectGroups = function() {
	var groups = [];
	
	list.children().each(function(index, item) {
		groups.push(jquery(item).children('.group-name').text());
	});

	return groups;
}

var updateGroups = function() {
	var csrfToken = jquery('#ci_csrf_token').val();
	var groups = collectGroups();

	var groupData = {
		groups: JSON.encode(groups),
		ci_csrf_token: csrfToken
	};

	jquery.ajax('/admin_school/update_work_hour_groups', { 
		data: groupData,
		method : 'POST',
		success: function(result)
		{	
			try {
				var data = JSON.parse(result);
			}
			catch(err) {
				edFlashAlert('error','Došlo je do pogreške!');
			}		
		},
		
		error: function(){
				edFlashAlert('error','Dogodila se greška prilikom dohvaćanja predmeta');
			}
		});
}

jquery("#work-hour-groups").sortable();
jquery("#work-hour-groups").on( "sortstop", function(event, ui) {
	updateGroups();
});

jquery('.icon-cancel').on('click', function(ev) {
	var item = jquery(ev.currentTarget).parent();
	item.remove();

	updateGroups();
});

jquery('#submit-new-group').on('click', function(ev) {
	var newName = jquery('#new-group-name').val();
	var existing = collectGroups();
	
	if(newName != '' && !existing.includes(newName.toUpperCase())) {
		var newItem = jquery('<li style="margin: 0 3px 3px 3px; padding: 0.4em; border: 1px solid black; width: 100px"><span class="group-name">' + newName.toUpperCase() + '</span><i class="icon-cancel right"></i></li>');
		list.append(newItem);

		updateGroups();
	}

	jquery('#new-group-name').val('');
});
