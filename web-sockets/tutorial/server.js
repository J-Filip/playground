// native node modules
const http = require('http');
const fs = require('fs');


  // path handling
  let path = './views';
  const PATHS = {
    '/': {
      path: '/index.html',
      statusCode: 200,
    },
    '/about': {
      path: '/about.html',
      statusCode: 200,
    },
    '/about-me': {
      path: '/about.html',
      statusCode: 301,
      redirect: '/about',
    },
    '/undefined': {
      path: '/404.html',
    },
  };

// create server instance
const server = http.createServer((req, res) => {
  console.log('request made');

  // set header content type
  res.setHeader('Content-Type', 'text/html');

  // send html file
  fs.readFile(getUserURL(), (error, data) => {
    if (error) {
      console.log(error);
      res.end();
      return;
    }
    res.write(data);
    res.end();
  });

  // get requested URL
  function getUserURL() {
    let url = req.url;
    try {
      let showPath = `${PATHS[url].path}`;
      res.statusCode = `${PATHS[url].statusCode}`;
      if (res.statusCode == 301) {
            res.setHeader('Location', `${PATHS[url].redirect}`);
            res.end();
      }
      return `${path}${showPath}`;
} catch (error) {
      res.statusCode = 404
      return `${path}${PATHS['/undefined'].path}`;
    }
  }
});

// localhost nas baca nazad na naš komp
// port brojevi su kao "vrata" u naše računalo - mail, videocall, web
server.listen(3000, 'localhost', () => {
  console.log('server listening');
});
