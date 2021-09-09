<!-- 
 DESCRIPTION: 
 * Pop up with search&filter for all schools in Croatia 
FEATURES: 
 SEARCH: 
 - search by name or MZO id 
 -->
<script>

  let input = '';
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
        const schoolListDiv = document.getElementById('school-search_list');
        e.classList.add('has-background-info-light');

        // get clicked div school name and show only that school
        let schoolName = e.querySelector('.school-name').innerText;
        schoolListDiv.innerHTML = e.outerHTML;

        // fill input with clicked div's school name
        input = schoolName;
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
        let rowElements = row.split(';');
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
              `<div class= 'box mt-2'>
              <h3 class = 'school-name'> ${match[2]} </h3>
              <p> Šifra ustanove: ${match[0]}  <br> 
            </div>`
          )
          .join('');
        const schoolListDiv = document.getElementById('school-search_list');
        schoolListDiv.innerHTML = matcheshtml;
        //return matcheshtml
      }
    }

    function clearIfInputEmpty() {
      //clean matches if empty input text
      if (input === '') {
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
</script>


<main>
  <section class="section">
    <div class="container">
      <input
        class="input is-rounded"
        placeholder="Search schools..."
        type="text"
        on:input={searchSchools(input)}
        bind:value={input}
      />
    </div>
    <div id="school-search_list" />
  </section>
</main>
