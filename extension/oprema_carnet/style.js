// ! style changes

// navbar logo
const navbar = document.querySelector('body > nav > a');
navbar.setAttribute('src', '/logo.png');
navbar.setAttribute(
  'style',
  'padding-right:20px;font-weight:500;color:#007bff'
);
navbar.innerText = `oprema.carnet.hr (admin)`;
