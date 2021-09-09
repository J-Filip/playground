/**
 * DESCRIPTION:
 * Content script for all of the CRM.
 * FEATURES:
 * AGENT STATUS:
 * - create button with agent's status
 * - when button clicked, new tab is opened and closed, and then agent's status changes and button changes style
 * QUEUE STYLE:
 * - queue headings font size incremented
 */

window.addEventListener('load', async () => {
  // elements created because they dont' have to wait for DOM to load
  const agentStatusButton = document.createElement('button');
  const agentStatusIconLink = document.createElement('link');
  // sleep used becasuse on specific CRM pages DOM loads but then it reloads some parts (bug?)
  await sleep(3000);
  let agentStatusButtonLocation = document.querySelector('#actionMenuSidebar'); // used several times
  styleQueue();
  fillAgentStatusButton();
  fillAgentStatusIcon();

  // queue
  function styleQueue() {
    // queues dont load when page loads so we have to target it again
    let queues = document.querySelectorAll('#pbxis-queues');
    for (let e of queues) {
      e.style['font-size'] = '14px';
    }
  }
  // style icon and then append link and icon
  function fillAgentStatusIcon() {
    let headTag = document.head;
    addIconStylesheet();
    headTag.append(agentStatusIconLink);
    // agentStatusButtonLocation.append(agentStatusIcon);
  }
  //  we use returned value from function and button and append styled button
  function fillAgentStatusButton() {
    let agentStatus = checkAgentStatus();
    // sidebar reloads when page loads so we have to target it again
    agentStatusButtonLocation = document.querySelector('#actionMenuSidebar');
    agentStatusButton.innerText = agentStatus;
    styleAgentStatusButton();
    agentStatusButtonLocation.append(agentStatusButton);

    function styleAgentStatusButton() {
      if (agentStatus === 'NESPREMAN') {
        agentStatusButton.classList.add('btn-status', 'btn-status__not-ready');
        return;
      }
      agentStatusButton.classList.add('btn-status', 'btn-status__ready');
    }
  }
  //  loop all spans, and return agent status
  function checkAgentStatus() {
    let spans = document.getElementsByTagName('span');
    let agentStatus = '';
    for (let span of spans) {
      if (span.innerText.includes('trenutno nespreman')) {
        agentStatus = 'NESPREMAN';
        //agentStatusIcon.classList.add('icon-status');
        return agentStatus;
      }
    }
    agentStatus = 'SPREMAN';
    //agentStatusIcon.classList.add('icon-status','icon-status__ready');
    return agentStatus;
  }

  //  style icon and icon link
  function addIconStylesheet() {
    agentStatusIconLink.rel = 'stylesheet';
    agentStatusIconLink.href =
      'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
  }

  // style button according to returned value from function

  // when button clicked, open tab that changes agent's status and return
  agentStatusButton.addEventListener('click', (event) => {
    event.preventDefault();
    openTabAndReturn();
  });

  // changing agent's status requires opening specific URL. Here we open new tab, sleep beacuse page loads slowly and then close it and reload home
  async function openTabAndReturn() {
    let changeAgentStatusURL =
      'https://suitecrm.carnet.hr/index.php?action=ajaxui#ajaxUILoc=index.php%3Fmodule%3DCases%26action%3DsetFreeForCase%26return_module%3DCases%26return_action%3Dindex';
    let home = window.location;
    let openTab = window.open(changeAgentStatusURL);
    await sleep(3000);
    openTab.close();
    home.reload();
  }

  // ! sleep
  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
});

// ? TESTING
// ! notifications
// setInterval(function(){
//   let count = document.querySelector("#desktop_notifications > button > span");
//   if(count.innerText > 0){
//         alert(count.innerText);
//        }
// },5000);

// let countBtn = document.querySelector("#desktop_notifications > button");
// countBtn.addEventListener('click', () => {
//   console.log('click');
//   console.log(count.innerText);

//   let count = document.querySelector("#desktop_notifications > button > span");
//   if(count.innerText > 0){
//     console.log(count.innerText);
//   }
// });

// ! change sidebar and toolbar style
/*
let sidebar = document.querySelector('#sidebar_container > div');
sidebar.style['background-color'] = '#3B3B3B';
// change toolbar style
let toolbar = document.querySelector('#ajaxHeader > nav > div');
toolbar.style['background-color'] = '#212121';
// change toolbar profile style
let profile = document.querySelector('#with-label');
profile.style['background-color'] = '#212121';
*/
