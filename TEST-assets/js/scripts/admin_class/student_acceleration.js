jquery('#school_class_id').on('change', function(ev) {
	var msg = jquery('#school_class_id option:selected').text();
	jquery('#accelerate-submit').attr('data-msg', msg);
});

new edConfirm('#accelerate-form #accelerate-submit', 'Učenik će biti akceleriran u odjel: <b>confirm-msg</b><br><br>Nakon uspješnog dovršetka procesa, u novom odjelu mu je potrebno dodijeliti predmete koje sluša i ostale zapise po potrebi');