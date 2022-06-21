new edConfirm('.student-final-grade-delete', _('Želite li obrisati zaključnu ocjenu?'));
new edConfirm('.student-grade-delete', _('Želite li obrisati confirm-msg?'));
new edConfirm('.loa-delete', _('Želite li obrisati ocjenu?'));

/* Rotate table headers */
window.addEvent('domready', function(){
    $$('#tbl-ocjene th.rotate').rotateHeaders();
});
