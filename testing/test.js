                                    
// ! custom events 
const hiButton1 = document.getElementById('say-hi1');
const hiButton2 = document.getElementById('say-hi2');

const xEvent = new CustomEvent ('xEvent', {
    detail: {
        backgroundColor : 'red'
    },

});

function changeColor (element){
    const bgColor = 'blue'
    element.style.backgroundColor = bgColor;
    hiButton1.dispatchEvent(xEvent);
}


changeColor(hiButton2);


hiButton1.addEventListener('xEvent', function(event) {
    element
  });




// async function testFetch () {

//     let response = await fetch('https://j-filip.github.io/my_resume/');

//     let data = await response.text();

//     console.log(data);



// }                 

// testFetch();



 // DOM //

// console.log(document.domain);
// console.dir(document);
// // change title
// document.title = 'Web mejloMlat';
// console.log(document.title);
// console.log(document.body);
// // not used but possible
// console.log(document.all);
// console.log(document.all[1]);


// BY ID //
// two ways to get it
// console.log(document.getElementById('mejlomlat'));

// var mejloMlat = document.getElementById('mejlomlat');
// var title = document.querySelector('.title');
//     // change text
// mejloMlat.textContent= 'nedsadi tekst';
//     // add html
// title.innerHTML = '<h2>MejloMlat</h2>';
//     // change color
// title.style.color = '#941';
//     // change value


// BY CLASS NAME //
// put each value to be each label
// var checkboxes = document.getElementsByClassName('mail-options');
// for (each of checkboxes){
//     console.log(each);
//     //each.value = each.label
// };

// BY TAG NAME //
// var labels = document.getElementsByTagName('label');
// for (each of labels){
//     // get all for values and change 
//     console.log(each.getAttribute('for'));
//     each.style.fontSize = '1.3rem';
// };

// QUERY - ONE
//var mejloMlat = document.querySelector('.editbox1');
//mejloMlat.style.backgroundColor = 'red';
// input
// var agentInput = document.querySelector('input');
// agentInput.value='agent smith';
// input with submit type
// var Submit = document.querySelector('input[type="submit"]');
// Submit.value = 'POSLANO';
// Submit.style.color = 'green';
// Submit.disabled = true;

// QUERY - ALL

// var inputs = document.querySelectorAll('.mail-input')
// for (each of inputs){
//     console.log(each);
//     each.style.border = '.6px solid blue';
//     // clear inputs
//     each.value = '';
// }



// CREATE BUTTON 2 - object
// const gdin = {
//     value: 'POŠTOVANI GOSPODINE',
//     id: 'gdin',
//     create: function (value,id) {
//         var newElement = document.createElement('INPUT');
//         newElement.setAttribute('value', this.value);
//         newElement.setAttribute('type', 'radio');
//         newElement.setAttribute('id', this.id);
//         newElement.setAttribute('class', 'mail-options');
//         document.body.appendChild(newElement);

//         var newLabel = document.createElement('LABEL');
//         newLabel.setAttribute('value', this.value);
//         newLabel.setAttribute('for', this.id);
//         newLabel.innerText = (this.id);
//         document.body.appendChild(newLabel);
//     }
// };
// const gdja = {
//     value: 'Poštovana gospođo',
//     id: 'gdja',
//     create: function (value,id) {
//         var newElement = document.createElement('INPUT');
//         newElement.setAttribute('value', this.value);
//         newElement.setAttribute('type', 'radio');
//         newElement.setAttribute('id', this.id);
//         newElement.setAttribute('class', 'mail-options');
//         document.body.appendChild(newElement);

//         var newLabel = document.createElement('LABEL');
//         newLabel.setAttribute('value', this.value);
//         newLabel.setAttribute('for', this.id);
//         newLabel.innerText = (this.id);
//         document.body.appendChild(newLabel);
//     }
// };
// gdin.create();
// gdja.create();




// CREATE BUTTON 1 - loop
// const helloGdin = 'Poštovani gospodine'
// const helloGdja = 'Poštovana gospođo'
// buttonsArray = [helloGdin, helloGdja];

// function createRadios(){
//     for (each of buttonsArray){
//         var newElement = document.createElement('INPUT');
//         newElement.setAttribute('type', 'radio');
//         newElement.setAttribute('value', each);
//         newElement.setAttribute('class', 'mail-options');
//         newElement.setAttribute('name', 'mail');
//         newElement.setAttribute('id', each);

// var newLabel = document.createElement('LABEL');
// newLabel.setAttribute('value', each);
// newLabel.setAttribute('for', each);
// newLabel.innerText = each;

//         document.body.appendChild(newElement);
//         document.body.appendChild(newLabel);
//     }   
// };
// createRadios();


                                // BASICS
// js test
// var adminName = 'Filip'
// const helloVar = 'Hello'

// // pozdravne poruke
// const helloGdin = 'Poštovani gospodine'
// const helloGdja = 'Poštovana gospođo'
// const helloDragi = 'Dragi'
// const helloDraga = 'Draga'
// const helloTicket = 'Pozdrav'
// const mainZahvala = 'zahvaljujemo na...'


// // inputs 
// const agentName = '' // input
// const adminPassword = '' // input

// const userIme = '' // input
// const userPrezime = '' // input
// const ustanova = '' // input
// const userAai = '' // input


// loops
// for loop
// var agentsMorning = ['Filip', 'Ivo', 'Perica', 'Mirka', '', 'Đoni'];
// var agentsMorningString = ''
// for (e of agentsMorning) {
//     if (e === 'Mirka') {         // if class becomes popodne - break
//         break;
//     }
//     agentsMorningString += '\n';
//     agentsMorningString += '1st ' + e;
// };
//console.log(agentsMorningString);


// while loop
// pozivi
// var pozivi = 0;
// var inputPozivi = 0;
// if (inputPozivi === '') {
//     inputPozivi = 1;
// }
// while (pozivi === 0) {
//     console.log(`Nema poziva! Na čekanju: ${pozivi}`);
// };
// if (pozivi >= inputPozivi) {
//     console.log(`POZIV NA ČEKANJU VIŠE OD ${pozivi} SEKUNDI!`);
// }



// ! objects
// ! this
// const agent = {
//     firstName: 'Agent',
//     lastName: 'Smith',
//     team: 'PP',
//     position: '2nd',
//     employed: false,
//     workingDays: ['2', '13', '24'],
//     sayTeam: function () {
//         console.log(this.team);
//     }
// };

// console.log(agent.workingDays);
// agent.sayTeam();




//  DOM
// const title = document.querySelector('.title');

// const userList = document.querySelectorAll('.user-list')
// const addButtons = document.querySelector('.add-buttons');
// const div = document.querySelector('.main-buttons');

// addButtons.addEventListener('click', function(){
//     const newBtn = document.createElement('RADIO');
//     const btnContent = document.createTextNode(helloGdin);
//     newBtn.append(btnContent);  
//     div.append(newBtn);
// });

// // button onclick toggle class


// title.classList.add('changeColor');         // adds class changecolor to elements with class title
// title.classList.remove('changeColor');         // removes class changecolor 




// stack solution
// my fix - without inline js
// function getInputValue(){
//     var checkboxes = document.getElementsByClassName('mail-options');
//     var checkboxesChecked = [];
//     // loop over them all
//     for (each of checkboxes) {
//         // And stick the checked ones onto an array...
//         if (each.checked) {
//             console.log(each);
//             checkboxesChecked.push(each.value);
//         }
//     }
//     document.getElementById("mejlomlat").value = checkboxesChecked;
// }
// var inputs = document.getElementsByClassName('mail-options');
// for (each of inputs){
//     each.addEventListener('click', function(){
//         getInputValue();
//     })
//     };




















// // query selector all
// // mail composer - attempt 2

// const helloOptions = document.querySelectorAll('input[name="radioHello"]');
// for (radio of helloOptions) {
//     var mail=[''];
//     radio.addEventListener('click', function () {
//         //console.log(this.value);
//         if (this.value === 'gdja') {
//             mail = `${helloGdja}  \n\n`;
//         }
//         if (this.value === 'gdin') {
//             mail = `${helloGdin}  \n\n`;
//         }
//         if (this.value === 'nadležna') {
//             mail.push('da');
//         }
//         mejloMlat.value = mail.toString();
//     })
// };

// var test = [];

// test.push('da');
// console.log(test);


        // mail composer - attempt 1
// var mail = '';
// const helloOption = document.querySelectorAll('input[name="radioHello"]');
// for (radio of helloOption){
//     //console.log(radio.value);
//     radio.addEventListener('change', function () {
//         //console.log(this.value);
//         if (this.value === 'gdja'){
//             mail = `${helloGdja}  \n\n`;
//         }
//         if (this.value === 'gdin'){
//             mail = `${helloGdin}  \n\n`;
//         }
//         mejloMlat.value = mail;
//     })
//     radio.addEventListener('click', function () {
//         if (this.value === 'zahvala' && this.checked ){
//             mail += mainZahvala;
//         } 
//         mejloMlat.value = mail;
//      })

//     };

const mainOption = document.querySelectorAll('input[name="checkMain"]');
for (check of mainOption){
    console.log(check.value);
    check.addEventListener('change', function () {
        if (this.checked){
            mail += 'da';
        }else{
            mail -= 'da';
        }
        mejloMlat.value = mail.text;
    })
};




//         console.log(radio.value);
//         if (radio.value === 'gdja'){
//             console.log('stisnuo gdja');
//             radio.style.color = 'red';
//     } 
//  })
// };




// const mailOptions = document.querySelectorAll(' .mail-options li id');
// for (user of mailOptions){
//     console.log(user );
//     user.addEventListener('click',function(){
//     if (user === 'gdja'){
//             this.style.color = 'blue';
//         }
//     });
// };





// // time
// // used for hello message, shifts(jutro, podne), raspored uglavnom
// var currentDate = new Date().toLocaleDateString("de-DE"); // normal date format
// var currentTime = new Date().getHours();
// // console.log(currentDate);
// // console.log(currentTime);

// // arrays
// // get 2nd agents - first two in array
// // last item in array
// // agentsMorning = ['Filip', 'Ivo', 'Perica', 'Mirka'];
// // console.log(agentsMorning.slice(0, 2));      // slice from zero to index 2 
// // console.log(agentsMorning[agentsMorning.length - 1]);
// // console.log(agentsMorning.indexOf('Ivo'));      // get index of value

// // agentsMorning.pop();            //remove last value
// // agentsMorning.push('last item');         // push value to back
// // agentsMorning.shift();         // remove first value
// // agentsMorning.unshift('first item');         // push value to front

// console.log(agentsMorning);      // slice from zero to index 2 




// // functions



// if (currentTime < 14) {
//     console.log('jutarnja smjena');
// } else {
//     console.log('popodnevna smjena');
// }


// // new way of declaring dfunctions - arrow functions
// // dollar sign for variables - cleaner look
// // typeof to see varable type   
// // AltGr+7 za ` 
// // && is AND, || is OR
// const helloAdmin = () => {
//     if (adminName === 'Filip' && adminPassword === true) {
//         console.log(`${helloVar} ${adminName}. Ti si admin? A da ziher. `);
//         console.log(typeof adminName);
//     }
// }

// helloAdmin(adminName);