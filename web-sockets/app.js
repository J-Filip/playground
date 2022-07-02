/**
 * Express - test
 */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
let index = require('./routes/index')
let people = require('./routes/people')

// specify port when we have .env files
const PORT = process.env.port || 3000;

// create express app
const app = express();

// parse incoming body
app.use(bodyParser.json())

// use index router
app.use('/', index)
// use people router
app.use('/api', people)

// listen for requests
app.listen(PORT);

// 404 page
// fires for every request
// acts like a catch all
// must be the last one
app.use((_req, res) => {
  res
    .status(404)
    .sendFile('./views/404.html', { root: path.join(__dirname, 'public') });
  //
});
