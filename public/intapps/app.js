/**
 * DESCRIPTION:
 * Content script for INTAPPS schedule (raspored).
 * FEATURES:
 * TODAY SCHEDULE:
 * - get today schedule on top and today's 2nd, 1st and extra agents
 * - highlight agent names in regular schedule
 * HIGHLIGHT USER IN SIDEBAR:
 * - bold agent name in sidebar for ease of use
 * TODO:
 * get only name and first letter of last name
 */

window.addEventListener('load', () => {
   const currentDate = new Date().toLocaleDateString('ro-RO'); // normal date format
  const selectedTeam = getSelectedTeam();
  const todayRow = getTodayRow();

  // main
  getCurrentShift();
  createSchedule();
  highlightAgentInSidebar();
  highlightTodayShift(getCurrentShift());

  // return shift based on current time
  function getCurrentShift() {
    // ! time
     let currentTime = new Date();

    let HDafternoonShiftStart = new Date();
    HDafternoonShiftStart.setHours(14, 50, 0);

    let POSafternoonShiftStart = new Date();
    POSafternoonShiftStart.setHours(13, 50, 0);
    if (
      (currentTime < POSafternoonShiftStart && selectedTeam.match('DM')) ||
      (currentTime < HDafternoonShiftStart && selectedTeam.match('HD')) ||
      (currentTime < POSafternoonShiftStart && selectedTeam.match('Matica'))
    ) {
      // morning shift
      return '1';
    }
    // afternoon shift
    return '2';
  }
  // return selected team from dropdown
  function getSelectedTeam() {
    // team selected
    let teams = document.querySelector('#team');
    let selectedTeam = teams.options[teams.selectedIndex].text;
    return selectedTeam;
  }
  // get row from which we read all data
  function getTodayRow() {
    let rows = document.querySelectorAll('tr');
    for (let row of rows) {
      //console.log(e.innerText);
      let dates = row.querySelectorAll('td.datum');
      for (let date of dates) {
        const dateText = date.innerText;
        if (dateText.includes(currentDate)) {
          return row;
        }
      }
    }
  }
  // get create div and populate with agents
  function createSchedule() {
    let scheduleLocation = document.querySelector(
      'body > div.container-fluid > div > div > form'
    );
    let canvas = document.createElement('div');
    canvas.classList.add('canvas__main');

    createHeadingCurrentShift();
    createCurentShift();
    scheduleLocation.append(canvas);

    function getAgents(shift, selectedTeam) {
      let agents = [];
      let extraAgents = [];
      try {
        weekendShift();
      } catch {
        normalShift();
      }
      return {
        agents,
        extraAgents,
      };

      function normalShift() {
        //console.log('normal shift');
        let agentRows = getTodayRow().querySelectorAll(
          `td.smjena_${shift}.ui-draggable`
        );
        for (let agent of agentRows) {
          if (agent.innerText != '') {
            agents.push(agent.innerText);
          }
        }
        assign2ndAgents();
        try {
          getExtraAgents();
        } catch {}
      }

      function weekendShift() {
        try {
          let agentsWeekend = getTodayRow().querySelectorAll(
            `td.smjena_${shift}.vikend.ui-draggable`
          );
          if (agentsWeekend.length < 2) {
            throw error;
          }
          for (let agent of agentsWeekend) {
            if (agent.innerText != '') {
              agents.push(agent.innerText);
            }
          }
          try {
            getExtraAgents();
          } catch {
            console.log('No extra agents');
          }
        } catch {
          throw error;
        }
      }

      function getExtraAgents() {
        let morningExtraAgents = [];
        let afternoonExtraAgents = [];
        let extraRow = getTodayRow().nextSibling;
        let extraTimes = extraRow.querySelectorAll('a');

        for (let extraTime of extraTimes) {
          let extraAgent = extraTime.parentElement.innerText.slice(0, -2);
          let extraTimeStart = extraTime
            .getAttribute('data-original-title')
            .substring(0, 2);
            let extraTimeFinish = extraTime
            .getAttribute('data-original-title')
            .substring(10, 13);
            console.log(extraTimeFinish);
          extraTime = extraTime
            .getAttribute('data-original-title')
            .substring(0, 16);
          if (extraTimeStart >= 14) {
            afternoonExtraAgents.push(`${extraAgent} (do ${extraTimeFinish}h)`);
          } else {
            morningExtraAgents.push(`${extraAgent} (od ${extraTimeStart}h)`);
          }
        }
        if (shift == 1) {
          extraAgents = morningExtraAgents;
          return;
        }
        extraAgents = afternoonExtraAgents;
      }

      function assign2ndAgents() {
        /**
         *  number of 2nd agents depends time of year and seelcted team, and is arranged internally.
         */
        switch (selectedTeam) {
          case 'HD':
            agents.splice(0, 1, `${agents[0]} - 2nd`);
            break;
          default:
            agents.splice(0, 2, `${agents[0]} - 2nd`, `${agents[1]} - 2nd`);
            break;
        }
      }
    }
    function getNumberOfAgents() {
      let { agents, extraAgents } = getAgents(
        getCurrentShift(),
        getSelectedTeam()
      );

      let numberOfAgents = agents.length + extraAgents.length;
      return numberOfAgents;
    }
    function createHeadingCurrentShift() {
      let headingCurrentShift = document.createElement('h3');
      headingCurrentShift.setAttribute('style', 'font-weight:700');
      headingCurrentShift.innerText = ` ${currentDate}.  Trenutna smjena: (${getNumberOfAgents()} agenata)`;
      canvas.append(headingCurrentShift);
    }
    function createCurentShift() {
      let { agentsString, extraAgentsString } = agentsToString();
      let regularAgents = document.createElement('p');
      regularAgents.classList.add('canvas__shift');
      regularAgents.innerText = `${agentsString}\n ${extraAgentsString}`;
      canvas.append(regularAgents);

      function agentsToString() {
        let { agents, extraAgents } = getAgents(
          getCurrentShift(),
          getSelectedTeam()
        );
        let agentsNewArray = [];
        let extraAgentsNewArray = [];

        for (agent of agents) {
          if (agent != '') {
            agentsNewArray += '\n';
            agentsNewArray += agent;
          }
        }
        for (agent of extraAgents) {
          if (agent != '') {
            extraAgentsNewArray += '\n';
            extraAgentsNewArray += agent;
          }
        }
        let agentsString = agentsNewArray.toString();
        let extraAgentsString = extraAgentsNewArray.toString();
        return {
          agentsString,
          extraAgentsString,
        };
      }
    }
  }
  // get user name and higlight in sidebar
  function highlightAgentInSidebar() {
    let sidebarList = document.querySelectorAll('#popisAgenata > li');
    let user = document.querySelector(
      'body > div.navbar.navbar-fixed-top > div > div > div > div > a'
    );
    user = user.innerText.slice(6).slice(0, -11);
    let userTrim = user.charAt(0).toUpperCase() + user.slice(1);
    // highlight user in sidebar
    for (let agent of sidebarList) {
      if (agent.innerText.includes(userTrim)) {
        agent.setAttribute('style', 'color:#00bfff;font-size:13px');
      }
    }
  }
  // highlight regular schedule today's row
  function highlightTodayShift(shift) {
    let agentRows = todayRow.querySelectorAll(
      `td.smjena_${shift}.ui-draggable`
    );
    agentRows.forEach((e) => {
      e.setAttribute('style', 'font-weight:800;color:#7b68ee');
    });
  }
});
