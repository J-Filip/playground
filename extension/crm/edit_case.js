/**
 * DESCRIPTION:
 * Content script for all edit case (uredi zahtjev) pages.
 * FEATURES:
 * ASSIGN SELF TO CASE
 * - create new button, when clicked assign yourself to the case
 */

// ! when DOM loaded
// all code that must be run when page loads
window.addEventListener('load', () => {
  // TODO : dropdown instead of button for selecting other responsible users (pp, pos, hd)
  const assignToSelfButton = document.createElement('button');
  appendAssignCaseToSelfButton();

  // ! event listeners
  assignToSelfButton.addEventListener('click', async (event) => {
    event.preventDefault();

    // TODO: put this in a function
    let data = await getAgentData();
    let { agentID, agentName } = data;
    const assignedAgentValue = document.querySelector('#assigned_user_id');
    const assignedAgentName = document.querySelector('#assigned_user_name');

    assignedAgentValue.value = agentID;
    assignedAgentName.value = agentName;
    assignedAgentName.textContent = agentName;

    changeButton();
  });

  // ! functions
  // append "Prebaci na sebe" button
  function appendAssignCaseToSelfButton() {
    const assignedAgent = document.querySelector(
      '#detailpanel_0 > div > div > div:nth-child(10) > div.col-xs-12.col-sm-8.edit-view-field.yui-ac'
    );
    assignedAgent.append(styleAssignToSelfButton());
  }

  // create "Prebaci na sebe" button
  function styleAssignToSelfButton() {
    assignToSelfButton.textContent = 'Prebaci na sebe';
    assignToSelfButton.classList.add('btn__save');
    return assignToSelfButton;
  }

  async function getAgentData() {
    let agentID = document
      .querySelector('#pagecontent > script:nth-child(18)')
      .innerText.substring(36)
      .slice(0, -2);
    let agentName = document.querySelector(
      '#with-label > span:nth-child(2)'
    ).textContent;
    /**
     * ? maybe a better way without using async, useful for combining with other apps
     * localStorage.setItem('AgentID', agentID);
     * localStorage.setItem('AgentName', agentName);
     */
    return {
      agentID,
      agentName,
    };
  }

  async function changeButton() {
    // const agentName = localStorage.getItem('Agent Name');
    let data = await getAgentData();
    let { agentName } = data;
    assignToSelfButton.textContent = `Prebačeno na ${agentName}`;
    assignToSelfButton.classList.add('btn__is-saved');
  }
});
