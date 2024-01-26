// // CREATE INPUTS //
// // CREATE BUTTON 3 - FUNCTION
// // best one for now

// // todo rewrite this using OOP


// document.addEventListener('DOMContentLoaded', () => {
//   'use strict';

//   let today = new Date();
//   let day =  today.getDate()
//   let month =  today.getMonth() + 1
  
//   let dateMonth = `${day}.${month}.`
//   console.log(today);
//   console.log(day);
//   console.log(month);

//   let focused = document.activeElement
//   const options = {
//       eventType: 'keyup',
//       keystrokeDelay: 1000
//   };

//   keyMapper([adder], options);


// function keyMapper(callbackList, options) {
//   const eventType = options && options.eventType || 'keydown';
//   const keystrokeDelay = options && options.keystrokeDelay || 1000;

//   let state = {
//       buffer: [],
//       lastKeyTime: Date.now()
//   };

//   document.addEventListener(eventType, event => {
//       const key = event.key;
//       const currentTime = Date.now();
//       let buffer = [];

//       if (currentTime - state.lastKeyTime > keystrokeDelay) {
//           buffer = [key];
//       } else {
//           buffer = [...state.buffer, key];
//       }

//       state = {buffer: buffer, lastKeyTime: currentTime};

//       callbackList.forEach(callback => callback(buffer));
//   });
// }

// function adder (keySequence){
//   const userInput = keySequence.join('').toLowerCase();
//   console.log(userInput);
//   const keySequences = {
//         'idfa': 'All Weapons + Ammo',
//         'dtm': `${dateMonth}Filip - `,
//     };

//   function typeInTextarea(newText, el = document.activeElement) {
//     const [start, end] = [el.selectionStart - 3, el.selectionEnd];
//     el.setRangeText(newText, start, end, 'end');
//   }
  
//   if(keySequences[userInput] === undefined){
//     return
//   }

//   typeInTextarea(keySequences[userInput]); 
  
//   // focused.onkeydown = e => {
//   //   if (e.key === "Enter") typeInTextarea("lol"); 
//   // }
  
//   // console.log(keySequences[userInput] );



    
//   };

// });








// // document.addEventListener('DOMContentLoaded', () => {
// //   'use strict';

// //   let buffer = [];
// //   let lastKeyTime = Date.now();

// //   document.addEventListener('keydown', event => {
// //       const charList = 'abcdefghijklmnopqrstuvwxyz0123456789';
// //       const key = event.key.toLowerCase();

// //       // we are only interested in alphanumeric keys
// //       if (charList.indexOf(key) === -1) return;

// //       const currentTime = Date.now();

// //       if (currentTime - lastKeyTime > 1000) {
// //           buffer = [];
// //       }

// //       buffer.push(key);
// //       lastKeyTime = currentTime;

// //        console.log('datum Filip - ');
      
// //     });


    
// //   });



// // window.addEventListener('keydown', (e) => {

  
// //   if(e.ctrlKey && e.key === 'b'){
// //     console.log('CTRL + B');
// //     document.dispatchEvent(
// //       new KeyboardEvent("a", {
// //           key: "b",
// //           ctrlKey: false,
// //           bubbles: true,
// //           metaKey: true   
// //       })
// //     );

// //     // let focused = document.activeElement
// //     //  focused.innerText  = 'daa'
// //   }
  
// // });













// let createHello = function (id, value, checked) {
//   var formHello = document.querySelector(".form-list_hello");
//   var newElement = document.createElement("INPUT");

//   newElement.setAttribute("type", "radio");
//   newElement.setAttribute("checked", checked);
//   newElement.setAttribute("class", "mail-options");
//   newElement.setAttribute("name", "mail-hello");
//   // newElement.setAttribute('checked', true); // this or add placeholder
//   newElement.setAttribute("id", id);
//   newElement.setAttribute("value", value);
//   formHello.appendChild(newElement);

//   var newLabel = document.createElement("LABEL");
//   newLabel.setAttribute("for", id);
//   newLabel.setAttribute("value", value);
//   newLabel.innerText = id;
//   formHello.appendChild(newLabel);
// };

// createHello("Gdin", `Poštovani gospodine\n\n`);
// createHello("Gdja", "Poštovana gospođo\n\n");
// createHello("Ticket", "Pozdrav\n\n", "checked");

// // create content inputs
// let createAnswer = function (id, value, x) {
//   var formAnswer = document.querySelector(".form-list_answer");
//   var newElement = document.createElement("INPUT");

//   newElement.setAttribute("type", "checkbox");
//   newElement.setAttribute("class", "mail-options");
//   newElement.setAttribute("name", "mail");
//   newElement.setAttribute("id", id);
//   newElement.setAttribute("value", value);
//   formAnswer.appendChild(newElement);

//   var newLabel = document.createElement("LABEL");
//   newLabel.setAttribute("for", id);
//   newLabel.setAttribute("value", value);
//   newLabel.innerText = id;
//   formAnswer.appendChild(newLabel);
// };
// createAnswer("zahvala", "zahvaljujemo na poslanim podacima. ");
// createAnswer("proslijeđeno", "Vaš upit proslijeđen je nadležnoj službi. ");
// createAnswer("korisnik: | ustanova:", `korisnik: \nustanova: `);
// // create bye inputs
// let createBye = function (id, value) {
//   var formBye = document.querySelector(".form-list_bye");
//   var newElement = document.createElement("INPUT");

//   newElement.setAttribute("type", "radio");
//   newElement.setAttribute("class", "mail-options");
//   newElement.setAttribute("name", "mail-bye");
//   newElement.setAttribute("id", id);
//   newElement.setAttribute("value", value);
//   formBye.appendChild(newElement);

//   var newLabel = document.createElement("LABEL");
//   newLabel.setAttribute("for", id);
//   newLabel.setAttribute("value", value);
//   newLabel.innerText = id;
//   formBye.appendChild(newLabel);
// };
// createBye("Za sve ostale", "\n\nZa sve ostale upite stojimo na raspolaganju.");
// createBye("Lijep pozdrav", "\n\nLijep pozdrav.");

// // loop all inputs, get checked values and push them to array
// function getInputValue() {
//   var inputs = document.getElementsByClassName("mail-options");
//   var inputsChecked = [];
//   // loop all
//   for (each of inputs) {
//     if (each.checked) {
//       inputsChecked.push(each.value);
//     }
//   }
//   // removes commas between elements
//   document.getElementById("mejlomlat").value = inputsChecked.join("");
// }

// // event listeners for korisnik  input
// let korisnikInput = document.getElementById("ime-korisnik");
// korisnikInput.addEventListener("input", function () {
//   let korisnikInputValue = document.getElementById("ime-korisnik").value;
//   let ustanovaInputValue = document.getElementById("ime-ustanova").value;

//   let gdinInput = document.getElementById("Gdin");
//   let gdjaInput = document.getElementById("Gdja");
//   let korUstInput = document.getElementById("korisnik: | ustanova:");

//   gdinInput.setAttribute(
//     "value",
//     `Poštovani gospodine ${korisnikInputValue},\n\n`
//   );
//   gdjaInput.setAttribute(
//     "value",
//     `Poštovana gospođo ${korisnikInputValue},\n\n`
//   );
//   korUstInput.setAttribute(
//     "value",
//     `korisnik:${korisnikInputValue} \nustanova: ${ustanovaInputValue} \n\n`
//   );

//   getInputValue();

//   const editHtml = document.getElementById("edit-html");
//   const editText = document.getElementById("mejlomlat").value;

//   newE = document.createElement("H2");
//   newE.innerText = editText;
//   editHtml.innerHTML = newE.innerHTML;
// });
// // // event listeners for ustanova  input
// let ustanovaInput = document.getElementById("ime-ustanova");
// ustanovaInput.addEventListener("click", function () {
//   let ustanovaInputValue = document.getElementById("ime-ustanova").value;
//   let korisnikInputValue = document.getElementById("ime-korisnik").value;

//   let korUstInput = document.getElementById("korisnik: | ustanova:");

//   korUstInput.setAttribute(
//     "value",
//     `korisnik: ${korisnikInputValue} \nustanova: ${ustanovaInputValue}\n\n`
//   );
//   getInputValue();
//   //updating big block of text
//   const editHtml = document.getElementById("edit-html");
//   const editText = document.getElementById("mejlomlat").value;

//   newE = document.createElement("H2");
//   newE.innerText = editText;
//   editHtml.innerHTML = newE.innerHTML;
// });
// //  event listeners for ustanova  click
// ustanovaInput.addEventListener("input", function () {
//   let ustanovaInputValue = document.getElementById("ime-ustanova").value;
//   let korisnikInputValue = document.getElementById("ime-korisnik").value;

//   let korUstInput = document.getElementById("korisnik: | ustanova:");

//   korUstInput.setAttribute(
//     "value",
//     `korisnik: ${korisnikInputValue} \nustanova: ${ustanovaInputValue}\n\n`
//   );
//   getInputValue();
//   //updating big block of text
//   const editHtml = document.getElementById("edit-html");
//   const editText = document.getElementById("mejlomlat").value;

//   newE = document.createElement("H2");
//   newE.innerText = editText;
//   editHtml.innerHTML = newE.innerHTML;
// });

// // event listeners when editbox clicked or typed on
// let inputs = document.getElementsByClassName("mail-options");
// for (each of inputs) {
//   each.addEventListener("click", function () {
//     getInputValue();
//   });
//   each.addEventListener("input", () => {
//     const editHtml = document.getElementById("edit-html");
//     const editText = document.getElementById("mejlomlat").value;

//     newE = document.createElement("H2");
//     newE.innerText = editText;
//     editHtml.innerHTML = newE.innerHTML;
//   });
// }

// // EVENT LISTENERS

// // when editbox focused
// const mejloMlat = document.querySelector(".input-box");
// mejloMlat.addEventListener("focus", function () {
//   mejloMlat.classList.add("input-box");
// });
// mejloMlat.addEventListener("blur", function () {
//   mejloMlat.classList.remove("input-box");
// });

// // show textarea value as html
// mejloMlat.addEventListener("input", () => {
//   const editHtml = document.getElementById("edit-html");
//   const editText = document.getElementById("mejlomlat").value;

//   newE = document.createElement("H2");
//   newE.innerText = editText;
//   editHtml.innerHTML = newE.innerHTML;
// });



// // DATA AND API

// // fetch is a method used to fecth a resource
// //   1. call fetch with some path (here its logo) - fetch is asynchronus which means it takes some time
// //   2. we get response - a stream of data
// //   3. then grab data from response body - a blob
// // * read about: promise, async/await, .then
// // - json from two diffrent api
// // library leaflet.js - build a map

// // CHALLENGE //
// // fetch:
// // - pictures for resume
// // - paragraps for resume
// // - get map in resume

// // create img
// var newElement = document.createElement("IMG");
// newElement.setAttribute("class", "fetched-div__logo");
// newElement.setAttribute("width", "80px");
// // select div and append to div
// var fetchedDivLogo = document.querySelector(".fetched-div-logo");
// //fetchedDivLogo.appendChild(newElement);

// // create par
// // actually i dont need this because i can put it in div innerHTML
// // var newElement = document.createElement('P');
// // newElement.setAttribute('class', "fetched-div_par");
// // fetchedDiv.appendChild(newElement);

// // // fetching 1 with .then
// // let fetchImg = function (img) {
// //     fetch(img)
// //      .then(response => {
// //         //console.log(response);
// //         return response.blob();
// //     }).then(blob => {
// //         document.querySelector('.fetched-img').src = URL.createObjectURL(blob);
// //     })
// //         .catch(error => {
// //             console.error(error);
// //         });
// // };
// // fetchImg('logo.png');

// // fetching 2 with async/await

// //fetching 2 async/await
// async function catchImg(img) {
//   let response = await fetch(img);
//   let blob = await response.blob();
//   document.querySelector(".fetched-div__logo").src = URL.createObjectURL(blob);
// }
// //catchImg('logo.png').catch(alert);

// async function catchPar(p) {
//   let response = await fetch(p);
//   let blob = await response.blob();
//   //console.log(response);
//   //console.log(blob);
//   document.querySelector(".fetched-div-learning").innerHTML +=
//     await blob.text();
// }
// //catchPar('fetch_learned.html')

// // // PROMISE
// // - is an Object
// // - 3 states - pending, fulfilled, rejected

// // FETCH - CSV
// // fetches local csv, manipulate data la la and add it to inner html
// // learn more - regular expression
// async function catchCSV() {
//   let response = await fetch("nasa.csv");
//   // if we forget await, we get uncaught error panjino jer event loop ide dalje i ne čeka promise od fetcha
//   let data = await response.text();
//   //console.log(data);
//   // split array with sperator - in this case linebreak
//   // slice array from index 2
//   rows = data.split("\n").slice(2);
//   // split each row with ,
//   for (const e of rows) {
//     row = e.split(",");
//     year = row[0];
//     temp = row[1];
//     console.log(year, temp);
//   }
//   // last one only
//   document.querySelector(".fetched-div-learning").innerHTML += year + temp;
// }
// //const xcatchCSV = setInterval(catchCSV,5000);

// // fetch data from csv and create dom elements
// async function catchCSV2() {
//   let response = await fetch("skole_os.csv");
//   // if we forget await, we get uncaught error panjino jer event loop ide dalje i ne čeka promise od fetcha
//   let data = await response.text();
//   //console.log(data);
//   // split array with sperator - in this case linebreak
//   // slice array from index 2
//   rows = data.split("\n").slice(1);
//   // split each row with ,
//   //console.log(rows);
//   for (const e of rows) {
//     rowData = e.split(";");
//     sifra = rowData[0] + "<br>";
//     naziv = rowData[1] + "<br>";
//     ravnatelj = rowData[8] + "<br>" + "<br>";

//     document.querySelector(
//       ".fetched-div-school"
//     ).innerHTML += `Šifra ustanove: ${sifra}Naziv: ${naziv} Ravnatelj: ${ravnatelj}`;
//   }
// }
// //catchCSV2();

// async function fetchByID(schoolID) {
//   let response = await fetch("skole_os.csv");
//   let data = await response.text();
//   //console.log(data);
//   rows = data.split("\n").slice(1);
//   console.log(rows);
//   for (const e of rows) {
//     rowData = e.split(";");
//     //console.log(rowData);
//     incl = rowData.includes(`\"${schoolID}\"`);
//     //console.log(incl);
//     if (incl == true) {
//       console.log(rowData[1]);
//     }
//   }
// }
// // get input from user
// //fetchByID(inputID);

// //get schoolID from user input
// async function fetchByName(schoolName) {
//   let response = await fetch("skole_os.csv");
//   let data = await response.text();
//   //console.log(data);
//   rows = data.split("\n").slice(1);
//   //console.log(rows);
//   for (const e of rows) {
//     rowData = e.split(";");
//     //console.log(rowData);
//     incl = rowData.includes(`\"${schoolName}\"`);
//     //console.log(incl);
//     if (incl == true) {
//       console.log(rowData[0]);
//       document.querySelector(".school-results_list").innerHTML = rowData[0];
//     }
//   }
// }
// //fetchByName('Osnovna škola Stjepana Basaričeka');

// async function fetchSchoolList() {
//   const schoolInput = document.getElementById(".school-search_input");
//   let response = await fetch("skole_os.csv");
//   let data = await response.text();
//   //console.log(data);
//   rows = data.split("\n").slice(1);
//   //console.log(rows);
//   rows.forEach((row) => {
//     rowElements = row.split(";");
//     //console.log(rowElements);
//     let schoolRow = document.createElement("LI");
//     schoolRow.innerText = rowElements.slice(0, 2) + rowElements.slice(7, 9);
//     //console.log(schoolRow);
//     schoolResultsList.append(schoolRow);
//   });
//   const schoolNameInput = document.getElementById("school-name-input");
//   schoolNameInput.addEventListener("input", function () {
//     //console.log(schoolNameInput.value);
//     rows.forEach((row) => {
//       //    console.log(row);
//       rowElements = row.split(";");
//       //console.log(rowElements);
//       incl = rowElements.includes(`\"${schoolNameInput.value}\"`);
//       //console.log(`\"${schoolNameInput}\"`);
//       //console.log(incl);
//       // console.log(schoolNameInput.value);
//       if (incl == true) {
//         //console.log(rowElements[1]);
//         let schoolRow = document.createElement("LI");
//         schoolRow.innerText = rowElements.slice(0, 2) + rowElements.slice(7, 9);
//         //console.log(schoolRow);
//         schoolResultsList.parentNode.replaceChild(schoolRow, schoolResultsList);
//       } else {
//       }
//     });
//   });
// }
// // fetkchSchoolList();

// // APP - TUTORIAL //

// // selectors
// const searchText = document.getElementById("school-search_input");
// const schoolList = document.getElementById("school-search_list");

// // search and filter school.csv
// const searchSchools = async function (searchText) {
//   let response = await fetch("sve_skole.csv");
//   let data = await response.text();
//   //console.log(data)
//   rows = data.split("\n").slice(1);
//   //console.log(rows);

//   // we need to make an array of arrays since we dont have json format. We loop through each row, split it on ; make an array and push it to array schoolList.
//   let schoolList = [];
//   rows.forEach((row) => {
//     rowElements = row.split(";");
//     rowElements.splice(2, 5);
//     rowElements.splice(4, 6);
//     schoolList.push(rowElements);
//   });
//   //console.log(schoolList);
//   // match input and data
//   // Regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions are also objects.
//   // filter array with regular expression.
//   // reg exp is an object. ^ matches the beginning of input. npr. when user types letter A, all strings that start with letter A are found. g is global and i is insensitive.
//   // we get match if array first element (šifra) matches regex or if it matches array second element (naziv)
//   let matches = schoolList.filter((schoolMatch) => {
//     //const regex = new RegExp(`${searchText}`, 'gi');
//     const regex = new RegExp(`${searchText}`, "gi");
//     return (
//       schoolMatch[0].match(regex) ||
//       schoolMatch[1].match(regex) ||
//       schoolMatch[2].match(regex) ||
//       schoolMatch[3].match(regex)
//     );
//   });
//   // clean matches if empty input text
//   if (searchText.length === 0) {
//     console.log("prazno");
//     matches = [];
//     document.getElementById("school-search_list").innerHTML = "";
//   }
//   console.log(matches);
//   showResults(matches);

//   // testing clicked div
//   const div = document.getElementById("school-search_list");
//   schoolListResult = div.childNodes;
//   //console.log(schoolListResult);
//   schoolListResult.forEach((e) => {
//     //console.log(e.innerText);
//     e.addEventListener("click", () => {
//       //console.log(e);
//       // we must query only clicked element
//       let schoolHeading = e.querySelector(".ime-skole").innerText;
//       let ustanovaInput = document.getElementById("ime-ustanova");
//       //console.log(schoolHeading);
//       let searchText = document.getElementById("school-search_input");

//       div.innerText = e.innerText;
//       searchText.value = schoolHeading;
//       ustanovaInput.value = schoolHeading;
//       // click ime ustanove so it triggers event that shows it in editbox
//       ustanovaInput.click();
//     });
//   });
// };

// // show in HTML
// const showResults = (matches) => {
//   // to make sure its not empty
//   // map returns array from array with results from calling function on every element
//   if (matches.length > 0) {
//     const matcheshtml = matches
//       .map(
//         (match) =>
//           `<div>
//             <h3 class= 'ime-skole'> ${match[1]} [${match[0]}] </h3>
//             <small> Osnivač:${match[2]}  </small> <br>
//             <small> Ravnatelj: ${match[3]} </small>      
//           </div>`
//         // we get an array of html strings
//       ) // then we use join method to convert them to strings
//       .join("");
//     schoolList.innerHTML = matcheshtml;
//   }
// };

// // event listener for user input
// searchText.addEventListener("input", () => searchSchools(searchText.value));
