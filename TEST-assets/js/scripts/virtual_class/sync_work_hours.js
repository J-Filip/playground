accordion = jquery('.ed-row.touch-row');

accordion.on('click',function(){
    var cc_id = jquery(this).data('cc-id');
    jquery(this).toggleClass('selected');
    jquery('table[data-cc-id='+cc_id+']').toggleClass('hide');
});