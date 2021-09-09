/**
 * DESCRIPTION:
 * Content script for oprema.carnet.hr device list
 * FEATURES:
 * FILTER:
 * - BY STATUS: list of owned, not owned  PCs
 * - BY TYPE: list of 1st batch, 2nd batch and pilot batch of PCs
 * REPORT BY TYPE:
 * - new report by type (every batch had diffrent type of PCs)
 */

window.addEventListener('load', () => {
  const deviceResults = document.querySelector('#results');
  const reportByStatus = document.querySelector(
    '#app > div > div > p:nth-child(3)'
  );
  const deviceRows = document.querySelectorAll('#results > tbody > tr');

  // main
  createStatusFilter();
  createTypeFilter();

  createStatusLabel();
  createTypeLabel();

  changeReportByStatus();
  createReportByType();

  //! functions
  function createStatusLabel() {
    filterStatus = document.createElement('label');
    filterStatus.setAttribute('id', 'filter-status');
    let statusPC = document.querySelector('#statusPC');
    statusPC.after(filterStatus);
  }
  function createTypeLabel() {
    filterType = document.createElement('label');
    filterType.setAttribute('id', 'filter-type');
    let typePC = document.querySelector('#typePC');
    typePC.after(filterType);
  }

  function createStatusFilter() {
    deviceStatus = document.createElement('select');
    deviceStatus.classList.add('select');
    deviceStatus.setAttribute('id', 'statusPC');
    deviceResults.before(deviceStatus);
    addOptions('Ukupno', 'Zaduženi', 'Nezaduženi');

    // options for filter
    function addOptions() {
      for (let argument of arguments) {
        let option = new Option(argument, deviceStatus);
      }
      // options constructor
      function Option(text, dropdown) {
        let option = document.createElement('option');
        option.innerText = text;
        dropdown.add(option);
        return option;
      }
    }
  }
  function createTypeFilter() {
    deviceType = document.createElement('select');
    deviceType.classList.add('select');
    deviceType.setAttribute('id', 'typePC');
    deviceStatus.after(deviceType);
    addOptions('Svi', 'Pilot', '1.faza isporuke', '2.faza isporuke');

    // options for filter
    function addOptions() {
      for (let argument of arguments) {
        let option = new Option(argument, deviceType);
      }
      // options constructor
      function Option(text, dropdown) {
        let option = document.createElement('option');
        option.innerText = text;
        dropdown.add(option);
        return option;
      }
    }
  }

  function changeReportByStatus() {
    let reportLabel = document.createElement('h2');
    reportLabel.innerText = 'OPĆENITO:';
    reportByStatus.before(reportLabel);
  }
  function createReportByType() {
    let { counterPilot, counter1stBatch, counter2ndBatch } = getReportByType();

    let report = document.createElement('p');
    report.setAttribute('id', 'type-report');
    report.innerText = `Pilot faza: ${counterPilot} 
    1. faza: ${counter1stBatch} 
    2. faza: ${counter2ndBatch}`;
    let reportLabel = document.createElement('h2');
    reportLabel.innerText = 'FAZA ISPORUKE:';
    reportByStatus.after(reportLabel, report);

    function getReportByType() {
      let counter1stBatch = 0;
      let counter2ndBatch = 0;
      let counterPilot = 0;
      for (let row of deviceRows) {
        let deviceType = row.querySelectorAll('td:nth-child(2)');
        for (let deviceName of deviceType) {
          switch (deviceName.innerText) {
            case 'Laptop Lenovo V330-15IKB':
            case 'Laptop HP ProBook 455 G6R':
              counter1stBatch++;
              break;
            case 'Laptop Lenovo ThinkBook 15-IIL':
            case 'Laptop HP ProBook 455 G7':
              counter2ndBatch++;
              break;
            default:
              counterPilot++;
              break;
          }
        }
      }
      return {
        counterPilot,
        counter1stBatch,
        counter2ndBatch,
      };
    }
  }

  function changeColor(color) {
    let selectedoption = document.querySelector('#statusPC');
    selectedoption.style.background = color;
  }

  deviceStatus.addEventListener('change', (event) => {
    hideAllRows();
    filteredDeviceRows = [];
    let deviceType = document.getElementById('typePC');
    //showAllRows();
    switch (event.target.value) {
      case 'Zaduženi':
        ownedPCs();
        changeColor('#8feb92');
        break;
      case 'Nezaduženi':
        notOwnedPCs();
        changeColor('#f089aecf');
        break;
      default:
        showAllRows();
        changeColor('#fff');
        filteredDeviceRows = deviceRows;
        break;
    }
    deviceType.dispatchEvent(new Event('change'));

    function ownedPCs() {
      let counter = 0;
      for (let row of deviceRows) {
        let deviceData = row.querySelectorAll('td:nth-child(5)');
        for (let device of deviceData) {
          if (device.innerText !== ' ') {
            counter++;
            filteredDeviceRows.push(row);
            row.setAttribute('style', 'display:');
          }
        }
      }
      console.log(counter);
      return counter;
    }
    function notOwnedPCs() {
      let counter = 0;
      for (let row of deviceRows) {
        let deviceData = row.querySelectorAll('td:nth-child(5)');
        for (let device of deviceData) {
          if (device.innerText === ' ') {
            counter++;
            filteredDeviceRows.push(row);
            row.setAttribute('style', 'display:');
          }
        }
      }
      return counter;
    }
    function showAllRows() {
      let counter = 0;
      for (let row of deviceRows) {
        counter++;
        row.setAttribute('style', 'display:');
      }
      return counter;
    }
    function hideAllRows() {
      for (let row of deviceRows) {
        row.setAttribute('style', 'display:none');
      }
    }
  });

  let filteredDeviceRows = [];
  let clickedFirst = true;
  deviceType.addEventListener('change', (event) => {
    // when this filter clicked first, filter all rows (else filter filtered rows from first filter)
    if (clickedFirst) {
      filteredDeviceRows = deviceRows;
      clickedFirst = false;
    }
    hideAllFilteredRows();
    switch (event.target.value) {
      case 'Pilot':
        changeLabel(
          typeOfPCs(
            'Laptop HP ProBook 640 G2',
            'Laptop Fujitsu Lifebook E544',
            'Hibridno računalo Fujitsu Lifebook T725',
            'Hibridno računalo Lenovo Yoga 260'
          ),
          filterType
        );
        break;
      case '1.faza isporuke':
        changeLabel(
          typeOfPCs('Laptop Lenovo V330-15IKB', 'Laptop HP ProBook 455 G6R'),
          filterType
        );
        break;
      case '2.faza isporuke':
        changeLabel(
          typeOfPCs(
            'Laptop Lenovo ThinkBook 15-IIL',
            'Laptop HP ProBook 455 G7'
          ),
          filterType
        );
        break;
      case 'Svi':
        changeLabel(showAllFilteredRows(), filterType);
        break;
    }
    //functions
    function changeLabel(filter, label) {
      if (filter === 0) {
        label.textContent = 'NEMA RAČUNALA U OVOJ KOMBINACIJI !';
        return;
      }
      label.textContent = `broj uređaja: ${filter} `;
    }
    function typeOfPCs() {
      let counter = 0;
      for (let row of filteredDeviceRows) {
        let deviceType = row.querySelectorAll('td:nth-child(2)');
        for (let deviceName of deviceType) {
          for (argument of arguments) {
            if (deviceName.innerText === argument) {
              counter++;
              row.setAttribute('style', 'display:');
            }
          }
        }
      }
      return counter;
    }
    function showAllFilteredRows() {
      let counter = 0;
      for (let row of filteredDeviceRows) {
        counter++;
        row.setAttribute('style', 'display:');
      }
      return counter;
    }
    function hideAllFilteredRows() {
      for (let row of filteredDeviceRows) {
        row.setAttribute('style', 'display:none');
      }
    }
  });
});
