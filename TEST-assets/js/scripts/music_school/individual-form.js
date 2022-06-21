$$('.checkbutton').addEvent('click', function (e) {
    if (this.hasClass('unchecked')) {
        $$('.checkbutton').addClass('unchecked');
        this.removeClass('unchecked');
        $('duration').set('value', this.get('data-value'));
    }
});

jquery("#absent").on('change', function(ev) {
    var checked = jquery(this).is(':checked');
    var absentFields = jquery('#absent-fieldset');

    if(checked) {
        absentFields.removeClass('hide');
    }
    else {
        absentFields.addClass('hide');
    }
});