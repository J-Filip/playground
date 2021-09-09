/* 
DESCRIPTION:  
Content script for all zahtjev(case) pages. 

FEATURES: 
TAGS:
    -

*/
// ! good practice for NOT polluting global
(async function main() {
  // CRM odd behaviour loads DOM but then it loads again, window.onLoad doesn't work so we put sleep to wait
  await sleep(3000);
  // ! get data for labels
  const service = document.querySelector(
    '#top-panel-1 > div > div:nth-child(2) > div:nth-child(1) > div.col-xs-12.col-sm-8.detail-view-field.inlineEdit'
  ).innerText;
  const serviceMore = document.querySelector(
    '#top-panel-1 > div > div:nth-child(2) > div:nth-child(2) > div.col-xs-12.col-sm-8.detail-view-field'
  ).innerText;
  const status = document.querySelector(
    '#top-panel-0 > div > div:nth-child(1) > div:nth-child(2) > div.col-xs-12.col-sm-8.detail-view-field.inlineEdit'
  ).innerText;
  const workGroup = document.querySelector(
    '#top-panel-1 > div > div:nth-child(4) > div:nth-child(1) > div.col-xs-12.col-sm-8.detail-view-field.inlineEdit'
  ).innerText;
  const assignedAgent = document.querySelector('#assigned_user_id').innerText;
  let sumActivities = document
    .querySelector(
      '#list_subpanel_history > table > thead > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > span'
    )
    .innerText.split(' ')[4]
    .slice(0, -1);

  function getUnreadMail() {
    const mails = document.querySelectorAll(
      '#list_subpanel_history > table > tbody > tr > td'
    );
    for (let mail of mails) {
      if (mail.innerText.match('Nepročitano')) {
        return 'NEPROČITANI MAIL';
      }
    }
    return false;
  }
  getUnreadMail();

  function getRtTask() {
    const rtTasks = document.querySelectorAll(
      '#list_subpanel_cnt_rt_tasks_cases > table > tbody > tr > td'
    );
    for (let status of rtTasks) {
      if (status.innerText.match('Novi')) {
        // rt task but we call it Ticket
        return 'TICKET';
      }
    }
    return false;
  }
  getRtTask();

  // ! putting labels to the DOM
  function createDivTags() {
    // todo create another tagLabel array and place it in another row(div)
    let tagLabels = [
      assignedAgent,
      status,
      workGroup,
      `Broj aktivnosti:${sumActivities}`,
      service,
      serviceMore,
      getUnreadMail(),
      getRtTask(),
    ];

    // for each element in array, filter then create span and append to tagsDiv
    let populatedTagLabels = tagLabels
      .filter((tag) => {
        return tag != false;
      })
      .map((element) => `<label> ${element}</label>`)
      .join('');
    return populatedTagLabels;
  }
  createDivTags();

  function appendTagsToDiv() {
    let tagsDiv = document.createElement('div');
    tagsDiv.id = 'tags';
    tagsDiv.innerHTML = createDivTags();
    return tagsDiv;
  }
  appendTagsToDiv();

  function appendDivToPage() {
    let pageContent = document.querySelector('#content');
    pageContent.prepend(appendTagsToDiv());
  }
  appendDivToPage();

  function stylePageTags() {
    let divTags = document.getElementById('tags').childNodes;
    let color;
    let colorCounter = 0;

    for (let label of divTags) {
      label.classList.add('label-tag');
      switch (colorCounter) {
        case 0:
          color = '#bb4cf9'; // purple
          break;
        case 1:
          color = '#f3724a'; // orange
          break;
        case 2:
          color = '#9f9ca1'; //
          break;
        case 3:
          color = '#bbbbbb';
          break;
        default:
          break;
      }

      // TODO if responsible agent equal to user, add diffrent tag
      switch (label.innerText) {
        case 'HD-POS':
          label.classList.add('label-tag__pos');
          break;
        case 'HD-PP':
          label.classList.add('label-tag__pp');
          break;
        case 'HD-CN':
          label.classList.add('label-tag__hd');
          break;
        case 'NEPROČITANI MAIL':
          label.setAttribute('style', 'background-color: #ff0404'); // red
          break;
        case 'TICKET':
          label.setAttribute('style', 'background-color: #dc0404'); // darekr red
          break;
        case 'Otvoren':
          label.setAttribute('style', 'background-color: #FFF'); // yellow
          break;
        case 'U radu':
          label.setAttribute('style', 'background-color: #21ce14bf'); // white
          break;
        case 'Na čekanju':
          label.setAttribute('style', 'background-color: #e0cf0fba'); // yellow
          break;
        case 'Zatvoren':
          label.setAttribute('style', 'background-color: #000'); // black
          break;
        default:
          label.setAttribute('style', `background-color: ${color}`); // gray
          colorCounter++;
          break;
      }
    }
  }
  stylePageTags();

  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
})();
