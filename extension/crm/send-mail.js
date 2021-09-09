/**
 * DESCRIPTION:
 * Content script for all send mail pages.
 * FEATURES
 * ALERT IF CASE EMPTY:
 * - when case empty, alert and get data from local storage
 * AUTOFILL:
 * - autocomplete mail inputs (bcc, from adress) based on signature
 * REMOVE ATTACHMENTS;
 * - remove attachments user sent
 */

window.addEventListener('load', async () => {
  // ! get data for
  await sleep(3000);
  getMailInputFields();
  highlightMailInputFields();
  listenMailInputFields();
  autocompleteMailInputFields();
  styleElements();
  cloneSendButton();
  removeAttachments();

  function getMailInputFields() {
    const relatedTo = document.querySelector('#parent_type');

    const caseValue = document.querySelector('#parent_id');
    const caseInput = document.querySelector('#parent_name');

    const fromAddresses = document.querySelector('#from_addr_name');
    const toAddress = document.querySelector('#to_addrs_names');
    const bcc = document.querySelector('#bcc_addrs_names');
    const subject = document.querySelector('#name');

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
    toAddress.style['background-color'] = '#8feb92'; // green
    bcc.style['background-color'] = '#8feb92'; // green
    subject.style['background-color'] = '#8feb92'; // green
  }

  function listenMailInputFields() {
    let { caseInput, bcc, toAddress, subject } = getMailInputFields();

    listenInput(caseInput);
    listenInput(toAddress);
    listenInput(bcc);
    listenInput(subject);

    function listenInput(element) {
      element.addEventListener('input', () => {
        if (element.value === '') {
          element.style['background-color'] = '#f089aecf'; // red
          return;
        }
        element.style['background-color'] = '#8feb92'; // green
      });
    }
  }
  function autocompleteMailInputFields() {
    let { caseValue, caseInput, bcc, subject, fromAddresses } =
      getMailInputFields();
    if (caseInput.value === '') {
      caseInputEmpty();
      function caseInputEmpty() {
        const workGroup = localStorage.getItem('Agent Group');
        const caseName = localStorage.getItem('Case Name');
        const caseInternalNumber = localStorage.getItem('Case Internal Number');
        const caseID = localStorage.getItem('Case ID');
        alertUser();
        changeCaseData();

        function alertUser() {
          alert(`Odabrani mail na koji će se spojiti sljedeći mail:
        
        Naziv zahtjeva: ${caseName} 
        Interni broj:  ${caseInternalNumber}
        
        PODSJETNIK: Potrebno je dodati smisleni naslov prije slanja maila ! `);
        }

        function changeCaseData() {
          caseInput.setAttribute('value', `${caseName}`);
          caseValue.setAttribute('value', `${caseID}`);
          subject.setAttribute(
            'value',
            `[ZAHTJEV:${caseInternalNumber}] (NASLOV)`
          );
        }
      }
    }

    //skrivena kopija
    function checkWorkgroup() {
      switch (getSignature()) {
        case 'POS':
          bcc.value = 'POS@o365.carnet.hr';
          if (fromAddressPOS() !== true) {
            changeAddressToPOS();
            addTagFromAddressChanged();
          }
          break;
        case 'HD':
          bcc.value = 'HDCN@o365.carnet.hr';
          // hd team sometimes uses POS from address so we dont change it for hd team
          break;
        default:
          bcc.value = 'Radna grupa nije definirana!';
          break;
      }

      function getSignature() {
        const signature = document.querySelector('.email-signature').innerText;
        if (signature.includes('Podrška obrazovnom sustavu')) {
          let workGroup = 'POS';
          // TODO - save to local first time this runs so we dont have to check for signature every time
          //localStorage.setItem('Work Group', workGroup);
          return workGroup;
        }
        let workGroup = 'HD';
        return workGroup;
      }

      function changeAddressToPOS() {
        for (e of fromAddresses) {
          if (e.value.match('Podrška obrazovnom sustavu')) {
            e.selected = 'true';
            let event = new Event('change');
            fromAddresses.dispatchEvent(event);
          }
        }
      }

      function fromAddressPOS() {
        if (fromAddresses.value.match('Podrška obrazovnom sustavu')) {
          // e.selected = 'true'
          return true;
        }
      }

      function addTagFromAddressChanged() {
        let fromAddressSpan = document.querySelector('#from_addr_name_infos');
        let fromAddressChanged = document.createElement('span');
        fromAddressChanged.innerText = ' Izmijenjena FROM adresa! ';
        fromAddressChanged.classList.add('btn__is-saved');
        fromAddressSpan.prepend(fromAddressChanged);
      }
    }
    checkWorkgroup();
  }
  function styleElements() {
    let { toAddress, textBox, sendIcon } = getMailInputFields();
    removeComma();
    textBox.setAttribute(
      'style',
      'width: 100%; height: 280px; display: block;'
    );
    sendIcon.setAttribute('style', 'font-size: 1.8em; color: #474254bd');

    // bug in crm, check if string starts with ',' and remove it
    function removeComma() {
      if (toAddress.value[0] === ',') {
        toAddress.value = toAddress.value.substring(2);
      }
    }
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
  function removeAttachments() {
    const attachments = document.querySelectorAll('.glyphicon-remove');
    if (attachments.length != 0) {
      for (let e of attachments) {
        e.click();
      }
      const attachmentsDiv = document.querySelector(
        '#ComposeView > div.attachments > div.file-attachments'
      );
      let attachmentsSpan = document.createElement('span');

      attachmentsSpan.innerText = 'Izbrisani privitci!';
      attachmentsSpan.classList.add('btn__is-saved');
      attachmentsDiv.prepend(attachmentsSpan);
    }
  }

  // ! sleep
  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
});
