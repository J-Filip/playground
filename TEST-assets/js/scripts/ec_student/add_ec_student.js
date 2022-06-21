var students_ms = new edMultiSelect({ elements : $$('.ed-row.touch-row'), input: $$('#selected_fields'), keys: ['id'] });
var filterInput = jquery('#filterBar');
var edRows = jquery('.ed-row.touch-row');
//filtriranje ucenika
jquery(document).ready(function(){
    filterInput.on('keyup',function(){
        var value = filterInput.val().toLowerCase();
        var regex = new RegExp(value);
        edRows.removeClass('hide');
        edRows.filter(function(){
           return !regex.test(jquery(this).text().toLowerCase());
        }).addClass('hide');
    });
});