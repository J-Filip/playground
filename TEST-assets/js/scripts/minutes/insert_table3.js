$('profession_id').addEvent('change', function (ev) {
    var profession_id = this.get('value');

    $$('.ccid').addClass('hide');
    $$('.profession-' + profession_id).removeClass('hide');
    $('class_course_start_option').set('selected', true);
    $('minutes_table_3_type_id_start_option').set('selected', true);
});

var CLASS_COURSE_TYPE_REGULAR = jquery('input[name=class_course_type_regular]').val();

jquery('#class_course_id').on('change',function(ev){
    var ccty = jquery(this).children(':selected').data('ccty');

    if (ccty != CLASS_COURSE_TYPE_REGULAR) {
        $('minutes_table_3_type').addClass('hide');
        $$('select[name=minutes_table_3_type_id]').removeProperty('data-required');
    } else {
        $('minutes_table_3_type').removeClass('hide');
        $$('select[name=minutes_table_3_type_id]').setProperty('data-required', 'true');
    }
});