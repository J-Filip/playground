import App from './App.svelte';

// inject bulma css
let headTag = document.head;

const agentStatusIconLink = document.createElement('link');
agentStatusIconLink.rel = 'stylesheet';
agentStatusIconLink.href =
  'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css';
headTag.append(agentStatusIconLink);

const background = document.querySelector('#content > div');
let placement = document.createElement('section');
background.after(placement);

//
let reactivateButton = document.querySelector('#reactivate-btn');
let reactivateLink = reactivateButton.getAttribute('href');

let newBtn = document.createElement('button');
newBtn.classList.add('button', 'is-primary', 'ml-1');

newBtn.innerText = 'Reaktiviraj&Osvježi';
reactivateButton.after(newBtn);

newBtn.addEventListener('click', async function handler() {
  ///this will execute only once
  let ask = confirm('Reaktiviraj token i osvježi stranicu?');
  if (ask == true) {
    let newtab = window.open(reactivateLink, '_blank');
    await sleep(2000);
    newtab.close();
    let home = window.location;
    home.reload();
  }
  return false;
});

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const app = new App({
  target: placement,
});

export default app;
