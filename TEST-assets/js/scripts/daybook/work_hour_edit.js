jquery(document).ready(function(){
    var toggleBtn = jquery('#toggle-held');
    var heldInput = jquery('#held');
    var class_course_select = jquery('#class_course_id');
    var noteLabel = jquery('label[for="note"]');
    var note = jquery('#note');
    var eschool_container = jquery('#e-school-container');
    var token = jquery('#ci_csrf_token').val();

    var updateClassCoursesForTeacher = function () {
        var insert_data = {
            held: heldInput.val(),
            ci_csrf_token: token
        };
        jquery.ajax
            ('/daybook/get_class_courses_for_insert_work_hour',
            {
                data: insert_data,
                method: 'POST',
                success: function (result) {
                    try {
                        var data = JSON.parse(result);
                    }
                    catch (err) {
                        edFlashAlert('error', 'Došlo je do pogreške!');
                    }
                    class_course_select.empty();
                    jquery.each(data.class_courses, function (i, val) {
                        class_course_select.append('<option value="' + val.id + '">' + val.name + '</option>');
                    });
                },
                error: function () {
                    edFlashAlert('error', 'Dogodila se greška prilikom dohvaćanja predmeta');
                }
            });
    }

    toggleBtn.edSwitch('#held');
    jquery('#toggle-e-schools-equipment-used').edSwitch('#e_schools_equipment_used');

    toggleBtn.on('click',function(e){
        updateClassCoursesForTeacher();
        eschool_container.toggleClass('hide');

        switch(heldInput.val()){
            case 'false': 
                noteLabel.html('Napomena: <i class="icon-asterisk required"></i>');
                note.attr('data-msg','napomenu');        
                break;
            case 'true': 
                noteLabel.html('Nastavna jedinica');
                note.attr('data-msg','nastavnu jedinicu');
                break;
            default: break;
        }
    });
});