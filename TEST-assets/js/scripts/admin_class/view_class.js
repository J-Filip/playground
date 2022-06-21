jquery('.student').edEditMenu('#group1');

new edConfirm('#reorder', _('Svim učenicima će se automatski dodjeliti redni brojevi. Nastavi?'));
new edConfirm('#remove-student', _('Želite li ukloniti učenika iz razreda?'));

if($('em-import')) {
	$('em-import').addEvent('click', function (e) {
		$('em-msg').set('html', _('Dohvat podataka iz eMatice... Molimo pričekajte'));
		$('em-import').setStyle('display', 'none');
	});
}