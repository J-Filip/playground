/**
 * DESCRIPTION:
 * Content script for oprema.carnet.hr employee list
 * FEATURES:
 * FILTER:
 * - filters: list of employees that own 0, 1 or more PC
 * TODO:
 * - add CSS
 */

window.addEventListener('load', () => {
  const employeeResults = document.querySelector('#results');
  const employeeRows = document.querySelectorAll('tr');


  // main
  createFilter();
  
  dropdownOwnsPC.addEventListener('change', (event) => {
    showAllRows();
    switch (event.target.value) {
      case 'Zaduženi':
        hideAllRows();
        changeStatus(statusOfPCs(1));
        changeColor('#8feb92');
        break;
      case 'Nezaduženi':
        hideAllRows();
        changeStatus(statusOfPCs(0));
        changeColor('#f089aecf');
        break;
      case 'Više računala':
        // moreThan1PC
        hideAllRows();
        changeStatus(moreThanOnePC());
        changeColor('#ffa5009c'); // orange
        break;
      default:
        changeStatus(showAllRows());
        changeColor('#fff');
        break;
    }
    function showAllRows() {
      // first row is column desc. and w dont count it
      let counter = -1;
      for (let row of employeeRows) {
        counter++;
        row.setAttribute('style', 'display:');
      }
      return counter;
    }
    function hideAllRows() {
      for (let row of employeeRows) {
        row.setAttribute('style', 'display:none');
      }
    }

    function statusOfPCs(number) {
      let counter = 0;
      for (let row of employeeRows) {
        let employeeData = row.querySelectorAll('td:nth-child(2)');
        for (let employee of employeeData) {
          numberOfPCs = employee.innerText.slice(-2, -1);
          if (numberOfPCs == number) {
            counter++;
            row.setAttribute('style', 'display:');
          }
        }
      }
      return counter;
    }

    function moreThanOnePC() {
      let counter = 0;
      for (let row of employeeRows) {
        let employeeData = row.querySelectorAll('td:nth-child(2)');
        for (let employee of employeeData) {
          numberOfPCs = employee.innerText.slice(-2, -1);
          if (numberOfPCs > 1) {
            counter++;
            row.setAttribute('style', 'display:');
          }
        }
      }
      return counter;
    }

    function changeStatus(counter) {
      let filterStatus;
      try {
        filterStatus = document.getElementById('filter-status');
        if (filterStatus == undefined) {
          throw error;
        }
      } catch {
        filterStatus = document.createElement('label');
        filterStatus.setAttribute('id', 'filter-status');
        console.log(filterStatus);
      }
      dropdownOwnsPC.after(filterStatus);
      filterStatus.textContent = `broj djelatnika: ${counter} `;
    }
    function changeColor(color){
      let selectedoption = document.querySelector("#statusPC");
      selectedoption.style.background = color;
    }
  });
F
  function createFilter() {
    dropdownOwnsPC = document.createElement('select');
    dropdownOwnsPC.classList.add('select');
    dropdownOwnsPC.setAttribute('id', 'statusPC');
    //dropdownOwnsPC.setAttribute("name", "biraj");
    employeeResults.before(dropdownOwnsPC);

    // options for filter
    function addOptions() {
      let option1 = new Option('Ukupno', dropdownOwnsPC);
      let option2 = new Option('Zaduženi', dropdownOwnsPC);
      let option3 = new Option(`Nezaduženi`, dropdownOwnsPC);
      let option4 = new Option(`Više računala`, dropdownOwnsPC);

      // options constructor
      function Option(text, dropdown) {
        let option = document.createElement('option');
        option.innerText = text;
        dropdown.add(option);
        return option;
      }
    }

    addOptions();
    return dropdownOwnsPC;
  }
});
