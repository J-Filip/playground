/**
 * Routes
 */
const path = require('path');
const express = require('express');
const router = express.Router();
const routes = require('./people')



// listen for get requests for'/'
router.get('/', (req, res) => {
  res.sendFile('./views/index.html', {
    root: path.join(__dirname, '../public'),
  });
});

router.get('/about', (req, res) => {
  res.sendFile('./views/about.html', {
    root: path.join(__dirname, '../public'),
  });
});

// redirect to about page
router.get('/about-us', (req, res) => {
  res.redirect('/about');
});

module.exports = router;
