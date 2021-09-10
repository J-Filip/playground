import App from './App.svelte'

// inject bulma css
let headTag = document.head;

const agentStatusIconLink = document.createElement('link');
agentStatusIconLink.rel = 'stylesheet';
agentStatusIconLink.href = "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css";
headTag.append(agentStatusIconLink);

// const background = document.querySelector("#content > div");
const background = document.querySelector("#content > div > div.t-center.mt100");
let placement = document.createElement("section");
background.after(placement);


const app = new App({
    target:placement
});

export default app;
