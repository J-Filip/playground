                                // CREATE INPUTS //
// CREATING BUTTONS - SOLUTION 3
// best one for now
// create hello inputs
let createHello = function (id,value) {
    var formHello = document.querySelector('.form-list_hello');
    var newElement = document.createElement('INPUT');

    newElement.setAttribute('type', 'radio');
    newElement.setAttribute('class', 'mail-options');
    newElement.setAttribute('name', 'mail-hello');
   // newElement.setAttribute('checked', true); // this or add placeholder 
    newElement.setAttribute('id', id);
    newElement.setAttribute('value', value);
    formHello.appendChild(newElement);

    var newLabel = document.createElement('LABEL');
    newLabel.setAttribute('for', id);
    newLabel.setAttribute('value', value);
    newLabel.innerText = (id);
    formHello.appendChild(newLabel);
};
createHello('Gdin.', 'Poštovani gospodine\n\n');
createHello('Gdja.', 'Poštovana gospođo\n\n');
// easily create more options
createHello('Dragi', 'Dragi\n\n');
createHello('Draga', 'Draga\n\n');
createHello('NONE', '');
// create content inputs
let createAnswer = function (id,value) {
    var formAnswer = document.querySelector('.form-list_answer');
    var newElement = document.createElement('INPUT');

    newElement.setAttribute('type', 'checkbox');
    newElement.setAttribute('class', 'mail-options');
    newElement.setAttribute('name', 'mail');
    newElement.setAttribute('id', id);
    newElement.setAttribute('value', value);
    formAnswer.appendChild(newElement);

    var newLabel = document.createElement('LABEL');
    newLabel.setAttribute('for', id);
    newLabel.setAttribute('value', value);
    newLabel.innerText = (id);
    formAnswer.appendChild(newLabel);
};
createAnswer('Zahvala','zahvaljujemo na poslanim podacima.');
createAnswer('Proslijeđeno','Vaš upit proslijeđen je nadležnoj službi.');
// create bye inputs
let createBye = function (id,value) {
    var formBye = document.querySelector('.form-list_bye');
    var newElement = document.createElement('INPUT');

    newElement.setAttribute('type', 'radio');
    newElement.setAttribute('class', 'mail-options');
    newElement.setAttribute('name', 'mail-bye');
    newElement.setAttribute('id', id);
    newElement.setAttribute('value', value);
    formBye.appendChild(newElement);

    var newLabel = document.createElement('LABEL');
    newLabel.setAttribute('for', id);
    newLabel.setAttribute('value', value);
    newLabel.innerText = (id);
    formBye.appendChild(newLabel);
};
createBye('Za sve ostale', '\n\nZa sve ostale upite stojimo na raspolaganju.');
createBye('Lijep pozdrav', '\n\nLijep pozdrav.');
createBye('NONE', '');

                                //  DO STUFF WITH INPUTS
// loop all inputs, get checked values and push them to array
function getInputValue() {
    var inputs = document.getElementsByClassName('mail-options');
    var inputsChecked = [];
    // loop all
    for (each of inputs) {
        if (each.checked) {
            inputsChecked.push(each.value);
        }
    }
    // removes commas between elements
    document.getElementById("mejlomlat").value = inputsChecked.join(' ');
}
// when input clicked
let inputs = document.getElementsByClassName('mail-options');
for (each of inputs) {
    each.addEventListener('click', function () {
        getInputValue();
    })
};

                                // EVENT LISTENERS

// when editbox focused
const mejloMlat = document.querySelector('.editbox1');
mejloMlat.addEventListener('focus', function () {
    mejloMlat.classList.add('changeEditBox');
});
mejloMlat.addEventListener('blur', function () {
    mejloMlat.classList.remove('changeEditBox');
});


















                           



