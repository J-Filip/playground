
var toggle = jquery('.touch-row');

toggle.on('click',function(e){
    var student_class_id = jquery(this).data('student-class-id');
    jquery(this).toggleClass('selected');
    jquery('div[data-student-class-id="'+ student_class_id +'"').toggleClass('hide');
});