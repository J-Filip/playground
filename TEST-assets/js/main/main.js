// TODO: import i require sve global dependencies

// ? require-context ako želimo sve
// ? namjerno želimo samo odabrane widgete radi manje koda?
// require('jquery-ui/ui/widgets/datepicker');


// ovo umjesto jquery-ui
// ? onda se ne mora svaki widget posebno unosit?
require('jquery-ui-bundle');

// nisam siguran kako se slažu moo tools i jquery - znam da je neki hack negdje napisan jer se preklapa sintaksa.
console.log(jQuery);
console.log($);
console.log(_);

// ! test
let x = $.datepicker.formatDate( "yy-mm-dd", new Date( 2007, 1 - 1, 26 ) );
console.log(x);

