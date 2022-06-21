$(document.body).addEvent("submit:relay(#search-student-by-oib)", function (e, element) {
    e.preventDefault();
    var data = this.toQueryString().parseQueryString();
    var url = this.get('action');
    $('message').set('html', '<h2>'+_('Dohvaćaju se podaci iz eMatice. Molimo pričekajte...')+'</h2>');
    new Request.HTML({
        url: url,
        method: 'post',
        data: data,
        update: 'modal-content',
        onSuccess: function (t, el, html) {
            repositionModal();
            picker.addEvent('close', function (e) {
                var minDate = new Date($('date_from').get('value'));
                var maxDate = new Date($('date_to').get('value'));
                if (minDate > maxDate) {
                    setTimeout(function () {
                        edAlert(_('Greška - datum završetka mora biti nakon datuma početka. Molimo odaberite ispravan datum početka ili završetka'));
                        $('datepicker_date_to').set('value', '');
                        $('date_to').set('value', '');
                        $('datepicker_date_from').blur();
                        $('datepicker_date_to').blur();
                    }, 300);
                }
            });
            new edValidate('#add_hospital_student_action');
        }
    }).send();
});

$(document.body).addEvent("click:relay(#back)", function (e, element) {
    e.preventDefault();
    var myRequest = new Request.HTML({
        url: '/admin_class/find_hospital_student',
        method: 'get',
        update: 'modal-content',
        onSuccess: function (tree, elements, html) {
            new edValidate('#search-student-by-oib');
            repositionModal();
        }
    }).send();
});

$(document.body).addEvent('change:relay(#original_school_id)', function (e, index) {
	$('sectionName').value=razredi[this.selectedIndex].sectionName;
	$('classType').value=razredi[this.selectedIndex].classType;
	$('profession_name').value=razredi[this.selectedIndex].profession_name;
	$('profession_id').value=razredi[this.selectedIndex].profession_id;
	$('class_type_id').value=razredi[this.selectedIndex].class_type_id;
});


function repositionModal() {
    var win_y = window.getSize().y;
    var modal_y = $('modal-window').getSize().y;
    var top;
    if (win_y < modal_y) {
        top = 0;
    } else {
        top = Math.floor((win_y - modal_y) / 2);
    }
    $('modal-window').setStyles({
        'top': top + 'px'
    });
}

jquery(document).ready(function(){
    var inactive = jquery('.touch-row.inactive');
    var inactive_button = jquery('#inactive-students');

    if (inactive_button.length>0 && inactive.length==0) {
        inactive_button.addClass('disabled');
    }
    else{
        inactive_button.on('click',function(e){
            inactive.toggle('inactive');
            if (inactive_button.html() == 'Prikaži neaktivne učenike')
                inactive_button.html('Prikaži samo aktivne učenike');
            else
                inactive_button.html('Prikaži neaktivne učenike');
        });
    }
});

