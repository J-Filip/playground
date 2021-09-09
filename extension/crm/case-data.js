/**
 * DESCRIPTION:
 * Content script for all case (zahtjev) pages.
 * FEATURES:
 * AUTOFILL CALL & MAIL EVIDENTION:
 * - autocomplete inputs when button for new mail and new call clicked
 * "SAVE CASE INFO" BUTTON:
 * - save case data to local storage for later use
 */

// ! when DOM loaded

window.addEventListener('load', async () => {
  // CRM odd behaviour loads DOM but then it loads again, window.onLoad doesn't work so we put sleep to wait
  await sleep(3000);
  // new call  button
  const createCall = document.querySelector(
    '#Activities_zabilježipoziv_button'
  );
  // new mail button
  const createMail = document.querySelector(
    '#Activities_sastavie-poštu_button'
  );
  appendSaveCaseButton();

  // ! create 'Spojen zahtjev' button
  function createSaveCaseInfoButton() {
    caseInfoButton = document.createElement('button');
    caseInfoButton.textContent = 'Spremi za spajanje';
    caseInfoButton.classList.add('btn__save');
    return caseInfoButton;
  }
  function appendSaveCaseButton() {
    let historyPanel = document.querySelector('#list_subpanel_history');
    historyPanel.before(createSaveCaseInfoButton());
  }

  // ! EVENT LISTENERS !

  // ! 'new call' button
  createCall.addEventListener('click', async () => {
    getCaseData();
    await sleep(3000);

    //setTimeout(function () {
      getCallInputFields();
      highlightCallInputFields();
      autocompleteCallInputFields();
      listenCallInputFields();
   // }, 3000);
  });

  let getCaseData = function () {
    // get naziv zahtjeva
    const caseName = document.querySelector('#name').innerText;
    // get zahtjevID value
    const caseID = document.querySelector(
      '#formDetailView > input[type=hidden]:nth-child(2)'
    ).value;
    // get interni broj zahtjeva
    const caseInternalNumber = document.querySelector('#case_number').innerText;
    // get ustanova
    const account = document.querySelector('#account_id').innerText;
    // get ustanova ID
    const accountID = document
      .querySelector('#account_id')
      .getAttribute('data-id-value');
    // get korisnik
    const contact = document.querySelector('#contact_id_c').innerText;
    // get korisnik ID
    const contactID = document
      .querySelector('#contact_id_c')
      .getAttribute('data-id-value');
    const workGroup = document.querySelector('#workgroup_c').value;
    return {
      caseName,
      caseID,
      caseInternalNumber,
      account,
      accountID,
      contact,
      contactID,
      workGroup,
    };
  };
  function getCallInputFields() {
    const subject = document.querySelectorAll('#name')[1];
    const callStatus = document.querySelectorAll('#status')[1];

    const description = document.querySelectorAll('#description')[1];

    const caseValue = document.querySelector('#acase_id_c');
    const caseInput = document.querySelector('#acase_c');

    const accountValue = document.querySelector(
      '#accounts_calls_1accounts_ida'
    );
    const accountInput = document.querySelector('#accounts_calls_1_name');

    const contactValue = document.querySelector(
      '#contacts_calls_1contacts_ida'
    );
    const contactInput = document.querySelector('#contacts_calls_1_name');
    return {
      subject,
      callStatus,
      description,
      caseInput,
      caseValue,
      accountInput,
      accountValue,
      contactInput,
      contactValue,
    };
  }
  function highlightCallInputFields() {
    let { subject, callStatus, description } = getCallInputFields();
    subject.style['background-color'] = '#f089aecf'; // red
    callStatus.style['background-color'] = '#f3e6aa'; // yellow
    description.style['background-color'] = '#f089aecf'; // red
  }
  function listenCallInputFields() {
    let { subject, description } = getCallInputFields();
    listenInput(subject);
    listenInput(description);
  }
  function autocompleteCallInputFields() {
    let { caseName, caseID, account, accountID, contact, contactID } =
      getCaseData();
    // }
    let {
      caseValue,
      caseInput,
      callStatus,
      accountInput,
      accountValue,
      contactInput,
      contactValue,
    } = getCallInputFields();

    // zahtjev
    caseValue.value = caseID;
    caseInput.value = caseName;
    // ustanove
    accountValue.value = accountID;
    accountInput.value = account;
    // korisnici
    contactValue.value = contactID;
    contactInput.value = contact;

    // status
    function callFinished() {
      for (let e of callStatus) {
        if (e.innerText.match('Održano')) {
          e.selected = true;
        }
      }
    }
    callFinished();
  }

  // !  'new mail' button
  createMail.addEventListener('click', async () => {
    getCaseData();
    await sleep(3000);
    // setTimeout(function () {
      getMailInputFields();
      highlightMailInputFields();
      listenMailInputFields();
      autocompleteMailInputFields();
      styleElements();
      cloneSendButton();
    // }, 3000);
  });

  function getMailInputFields() {
    let relatedTo = document.querySelector('#parent_type');

    const caseValue = document.querySelector('#parent_id');
    const caseInput = document.querySelector('#parent_name');

    const fromAddresses = document.querySelector('#from_addr_name');
    const toAddress = document.querySelector('#to_addrs_names');
    const bcc = document.querySelector('#bcc_addrs_names');
    const subject = document.querySelectorAll('#name')[1];

    // tijelo
    const textBox = document.querySelector('#description_ifr');
    const sendIcon = document.querySelector(
      '#ComposeView > div.panel.panel-default.panel-email-compose > div > div > button.btn.btn-send-email > span'
    );
    const sendButton = document.querySelector('.btn-send-email');

    return {
      relatedTo,
      caseValue,
      caseInput,
      fromAddresses,
      toAddress,
      bcc,
      subject,
      textBox,
      sendIcon,
      sendButton,
    };
  }

  function highlightMailInputFields() {
    let { caseInput, bcc, toAddress, subject } = getMailInputFields();

    caseInput.style['background-color'] = '#8feb92'; // green
    toAddress.style['background-color'] = '#f089aecf'; // red
    bcc.style['background-color'] = '#8feb92'; // green
    subject.style['background-color'] = '#f089aecf'; // red
  }

  function listenMailInputFields() {
    let { caseInput, bcc, toAddress, subject } = getMailInputFields();

    listenInput(caseInput);
    listenInput(toAddress);
    listenInput(bcc);
    listenInput(subject);
  }

  function autocompleteMailInputFields() {
    let { workGroup, caseID, caseName, caseInternalNumber } = getCaseData();
    let { caseValue, caseInput, bcc, subject, relatedTo, fromAddresses } =
      getMailInputFields();

    // zahtjev
    caseValue.value = caseID;
    caseInput.value = caseName;
    //skrivena kopija
    function checkWorkgroup() {
      switch (workGroup) {
        case 'HD-PP':
        case 'HD-POS':
          bcc.value = 'POS@o365.carnet.hr';
          fromAddressPOS();
          break;
        case 'HD-CN':
          bcc.value = 'HDCN@o365.carnet.hr';
          fromAddressHD();
        default:
          bcc.value = 'Radna grupa nije PP, POS ili CN!';
          break;
      }
    }
    checkWorkgroup();

    caseValue.value = caseID;
    // subjekt
    subject.value = `[ZAHTJEV:${caseInternalNumber}] (NASLOV)`;
    // povezano sa
    function relatedToCase() {
      for (let e of relatedTo) {
        if (e.innerText.match('Zahtjev')) {
          e.selected = 'true';
        }
      }
    }
    relatedToCase();

    function fromAddressPOS() {
      for (e of fromAddresses) {
        if (e.innerText.match('Podrška obrazovnom sustavu')) {
          e.selected = 'true';
          let event = new Event('change');
          fromAddresses.dispatchEvent(event);
        }
      }
    }

    function fromAddressHD() {
      for (e of fromAddresses) {
        if (e.innerText.match('CARNET Helpdesk')) {
          e.selected = 'true';
          let event = new Event('change');
          fromAddresses.dispatchEvent(event);
        }
      }
    }
  }

  function styleElements() {
    let { textBox, sendIcon } = getMailInputFields();

    textBox.setAttribute(
      'style',
      'width: 100%; height: 280px; display: block;'
    );
    sendIcon.setAttribute('style', 'font-size: 1.8em; color: #474254bd');
  }

  function cloneSendButton() {
    // clone send button and append to body (tijelo)
    let { sendButton } = getMailInputFields();
    const body = document.querySelector(
      '#detailpanel_-1 > div > div > div:nth-child(15) > div.col-xs-12.col-sm-2.label'
    );

    const newSendButton = sendButton.cloneNode(true);
    newSendButton.setAttribute('style', 'margin:1em');
    body.appendChild(newSendButton);
  }

  // ! 'save for joined mail' button (Spremi za spojeni mail)
  caseInfoButton.addEventListener('click', () => {
    getCaseData();
    let { caseName, caseID, caseInternalNumber } = getCaseData();

    // save data in chrome local storage for later use
    localStorage.setItem('Case Name', caseName);
    localStorage.setItem('Case Internal Number', caseInternalNumber);
    localStorage.setItem('Case ID', caseID);
    changeButton();
  });

  function changeButton() {
    caseInfoButton.textContent = 'Spremljeno';
    caseInfoButton.classList.add('btn__is-saved');
  }

  //  ! style listener functions
  // listen if element input empty and change color
  function listenInput(element) {
    element.addEventListener('input', () => {
      if (element.value === '') {
        element.style['background-color'] = '#f089aecf'; // red
        return;
      }
      element.style['background-color'] = '#8feb92'; // green
    });
  }

  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
});
