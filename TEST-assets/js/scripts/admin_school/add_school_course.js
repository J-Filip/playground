window.addEvent('domready', function () {
  let courseID = jquery('#course_id');

  if (jquery('trazilica')) {
    var $elem = jquery('#trazilica').autocomplete({
      // minimalna količina upisanih slova potrebna za dohvaćanje rezultata
      minLength: 3,
      //treba mu drukciji style zbog velikog broja vraćenih rezultata
      classes: {
        'ui-autocomplete': 'ui-autocomplete__new',
      },
      //  ako je user admin, stvore se dva autocompleta (pretraživanje i ovaj)
      // ovom autocompletu treba maknuti ui-menu class jer se inače krivo pozicionira - layout.less?
      create: function () {
        if (jquery('ul.ui-widget').length === 1) {
          jquery('ul.ui-widget')[0].removeClass('ui-menu');
        } else {
          jquery('ul.ui-widget')[1].removeClass('ui-menu');
        }
      },
      // dohvaća predmete ovisno danom inputu i prikazuje ih u dropdownu
      source: function (request, response) {
        jquery.ajax({
          url: '/admin_school/search_school_course/' + request.term,
          method: 'GET',
          dataType: 'json',
          success: function (data) {
            response(data);
          },
        });
      },
      // triggera se kad je field blurred
      // zaazeleni field ako je odabran predmet iz dropdowna
      change: function (event, ui) {
        event.currentTarget.toggleClass('selected', ui.item != null);
      },
      // triggera se ako je odabran predmet iz dropdowna
      // posalji id predmeta u hidden input koji se salje u bazu 
      select: function (event, ui) {
        courseID.val(ui.item.id);
      },
      // svaki put kad dohvaća predmete - ako želimo dopisati nešto nakon što smo već izabrali predmet, izbriše se course id
      search: function (event, ui) {
        if (ui.item == null) {
          courseID.val('');
        }
      },
    });

    // boldanje upisanog teksta
    elemAutocomplete =
      $elem.data('ui-autocomplete') || $elem.data('autocomplete');
    if (elemAutocomplete) {
      elemAutocomplete._renderItem = function (ul, item) {
        var newText = String(item.value).replace(
          new RegExp(this.term, 'gi'),
          "<span class='ui-autocomplete__highlight'>$&</span>"
        );
        return jquery('<li></li>')
          .data('ui-menu-item', item)
          .append('<li>' + newText + '</li>')
          .appendTo(ul);
      };
    }
  }

  //   jquery('#form-add-school-course > input.button2').click(function (event) {
  //     let courseID = jquery("#course_id").val()
  //     if (courseID == '') {
  //       event.preventDefault();
  //   }
  // })

  new edConfirm('.delete-course-target', _('Želite li obrisati predmet'), {
    onConfirm: function (ev, el) {
      ev.preventDefault();
      var href = el.getProperty('href');

      var req = new Request({
        method: 'get',
        url: href,
        onRequest: function () {
          return false;
        },
        onComplete: function (response) {
          var data;

          try {
            data = JSON.parse(response);
          } catch (err) {
            data = null;
          }

          if (data !== null) {
            if (data.error === 0) {
              window.location.reload();
            } else if (data.message !== null) {
              edAlert(data.message);
            }
          } else {
            window.location.reload();
          }
        },
      }).send();
    },
  });
});
