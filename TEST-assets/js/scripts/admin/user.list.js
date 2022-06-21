new edConfirm('.token-delete', 'confirm-msg1 ' + _('Želite li obrisati token za korisnika') + ' confirm-msg?');

if ($('user-pin-reset')){
	new edConfirm('#user-pin-reset', _('Želite li resetirati PIN korisniku') + ' confirm-msg?');
}

if ($('delete-user')){
	new edConfirm('#delete-user', _('Želite li ukloniti korisnika') + ' confirm-msg ' + _('sa škole') + '?');
}

jquery('tr.action-user').edEditMenu('#group1');
