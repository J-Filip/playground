/**
 * Routes
 */
const express = require('express');
const router = express.Router();

router.get('/people', (req, res) => {
  res.send({
    type: 'GET',
    name: 'Fico'
  });
});

// add new
router.post('/people', (req, res) => {
  let{name, age} = req.body
  res.send({
    type: 'POST', 
    name, 
    age, 
  }); 
});

// update people
router.put('/people/:id', (req, res) => {
  res.send({
    type: 'PUT',
  });
});

// delete people
router.delete('/people/:id', (req, res) => {
  res.send({
    type: 'DELETE',
  });
});

module.exports = router;
