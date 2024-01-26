// testing url recognition

let re = /(\bhttp\S+\b)/ig;
// let newRe = new RegExp(
//     "^" +
//       // protocol identifier (optional)
//       // short syntax // still required
//       "(?:(?:(?:https?|ftp):)?\\/\\/)" +
//       // user:pass BasicAuth (optional)
//       "(?:\\S+(?::\\S*)?@)?" +
//       "(?:" +
//         // IP address exclusion
//         // private & local networks
//         "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
//         "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
//         "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
//         // IP address dotted notation octets
//         // excludes loopback network 0.0.0.0
//         // excludes reserved space >= 224.0.0.0
//         // excludes network & broadcast addresses
//         // (first & last IP address of each class)
//         "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
//         "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
//         "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
//       "|" +
//         // host & domain names, may end with dot
//         // can be replaced by a shortest alternative
//         // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
//         "(?:" +
//           "(?:" +
//             "[a-z0-9\\u00a1-\\uffff]" +
//             "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
//           ")?" +
//           "[a-z0-9\\u00a1-\\uffff]\\." +
//         ")+" +
//         // TLD identifier name, may end with dot
//         "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
//       ")" +
//       // port number (optional)
//       "(?::\\d{2,5})?" +
//       // resource path (optional)
//       "(?:[/?#]\\S*)?" +
//     "$", "i"
//   );

// let newRe = /(^|[?\s])(www\.[^? ]+\/[^/ ]*\?[^? ]*[^?.,! ]|www\.[^? ]*[^?.,! ])/g;










// let newRe = /https?:\/\/\S+\.[^()]+(?:\([^)]*\))*/gm;
// let newRe = /\b(https?:\/\/\S*\b[\/])/g;
let newRe = /\b(https?:\/\/\S*[\/])/g;

let links = [
    ', https://developer.mo-zilla.org/.',
    'https://developer.mozilla.org/,',
    'https://developer.mozilla.org/en-us.',
    '(http://developer.mozilla.org/en-us) i',
    
]

let text = `

U slučaju da se radi o prvoj aktivaciji mTokena, prijava na portal moguća je putem sustava e-Građani. Ako djelatnik već ima aktiviran mToken (https://mtoken.carnet.hr) koji je potrebno reaktivirati, na portal se moguće prijaviti s jednokratnom lozinkom mTokena ili putem sustava e-Građani. 

U slučaju da se radi o prvoj aktivaciji mTokena, prijava na portal moguća je putem sustava e-Građani. Ako djelatnik već ima aktiviran mToken (https://mtoken.carnet.hr/) koji je potrebno reaktivirati, na portal se moguće prijaviti s jednokratnom lozinkom mTokena ili putem sustava e-Građani. 


Poveznica za pristup je: https://sigma-test.e-skole.hr. 
Poveznica za pristup je: https://sigma-test.e-skole.hr/. 
Poveznica za pristup je: https://sigma-test.e-skole.hr/: 
Poveznica za pristup je: https://sigma-test.e-skole.hr/; 

Prijava se vrši tako da korisnik pod “Korisničko ime” unese AAI@Edu.hr identitet (@skole.hr) koji je bio upisan u poslanoj tablici, a pod polje “Lozinka” treba prepisati jednokratnu lozinku dobivenu prilikom upisivanja PIN-a u CARNET mToken aplikaciji. 

Također, na ovoj poveznici https://www.carnet.hr/wp-content/uploads/2021/10/RIMS-CARNET-SIGMA_v5.pdf se nalazi detaljan popis funkcionalnosti po modulima. 

Podsjećamo da se potpisivanjem Zahtjeva za uključenje u projekt e-Škole, sukladno CDA0062 dokumentu koji se nalazi na sljedećoj poveznici: https://www.e-skole.hr/wp-content/uploads/2019/03/CDA0062-2.pdf, škola se obvezuje čuvati opremu s pažnjom dobrog gospodarstvenika i poduzeti sve potrebne mjere za zaštitu predmetne IT opreme od mogućih prirodnih nepogoda i katastrofa uzrokovanih klimatskim promjenama. 

Karakteristike isporučenih uređaja možete vidjeti na poveznici: https://www.e-skole.hr/specifikacije/.`

links.forEach(element => {
    let newElement = element.replace(newRe, `<a href="$&">$&</a>`);
    // console.log(newElement);
});

let newText = text.replace(newRe, `<a href="$&">$&</a>`);

console.log(newText);
