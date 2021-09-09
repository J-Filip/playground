/**
 * DESCRIPTION:
 * Pop up with search&filter for all schools in Croatia
 * FEATURES:
 * SEARCH:
 * - search by name or MZO id
 */

// ! selectors
let searchText = document.getElementById('school-search_input');
let userInput = document.getElementById('school-search_input').value;
const schoolListDiv = document.getElementById('school-search_list');
searchText.focus();

// main
// event listener for user input
searchText.addEventListener('input', () => searchSchools(searchText.value));

// search and filter school.csv
const searchSchools = async function (userInput) {
  let data = await fetchSchools('skole_matica2.csv');
  let schoolList = cleanData(data);
  /*
  match input and data
  - regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions are also objects.
  - filter array with regular expression.
  - reg exp is an object. ^ matches the beginning of input. npr. when user types letter A, all strings that start with letter A are found. g is global and i is insensitive.
  . we get match if array first element (šifra) matches regex or if it matches array second element (naziv)
  */
  let matches = schoolList.filter((schoolMatch) => {
    const regex = new RegExp(`${userInput}`, 'gi');
    return schoolMatch[0].match(regex) || schoolMatch[2].match(regex);
  });
  clearIfInputEmpty();
  showResults(matches);

  // listener for each results div
  getResultsDiv().forEach((e) => {
    e.addEventListener('click', () => {
      // get clicked div school name and show only that school
      let schoolName = e.querySelector('.ime-skole').innerText;
      schoolListDiv.innerText = e.innerText;

      // fill input with clicked div's school name
      searchText.value = schoolName;
    });
  });

  // functions
  async function fetchSchools(table) {
    let response = await fetch(table);
    let data = await response.text();
    return data;
  }

  function cleanData(data) {
    let rows = data.split('\n').slice(1);

    // we need to make an array of arrays since we dont have json format. We loop through each row, split it on ; make an array and push it to array schoolList.
    let schoolList = [];
    rows.forEach((row) => {
      rowElements = row.split(';');
      // rowElements.splice(2, 5);
      // rowElements.splice(4, 6);
      schoolList.push(rowElements);
    });
    return schoolList;
  }

  function showResults(matches) {
    if (matches.length > 0) {
      // we get an array of html strings
      // then we use join method to convert them to strings
      const matcheshtml = matches
        .map(
          (match) =>
            `<div>
              <h3 class= 'ime-skole'> ${match[2]} </h3>
              <p> Šifra ustanove: ${match[0]}  <br> 
            </div>`
        )
        .join('');
      schoolListDiv.innerHTML = matcheshtml;
    }
  }

  function clearIfInputEmpty() {
    console.log(userInput.length);
    //clean matches if empty input text
    if (userInput.length === 0) {
      console.log('prazno');
      matches = [];
      document.getElementById('school-search_list').innerHTML = '';
    }
  }
  function getResultsDiv() {
    // testing clicked div
    let resultsDiv = document.getElementById('school-search_list');
    let schoolListResult = resultsDiv.childNodes;
    return schoolListResult;
  }
};

// ? testing
//searchText.addEventListener('click', () => btnClicked(tab));
// // options html
// let optionsButton = document.querySelector(".is-primary");
// optionsButton.addEventListener('click',function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('/options.html'));
//   }
// });
