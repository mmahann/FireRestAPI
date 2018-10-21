var express = require('express');
var router = express.Router();

var db = require('../queries')

router.get('/api/fires', db.getAllFires);
router.get('/api/fires/:id', db.getSingleFire);
router.post('/api/fires', db.createFire);
router.put('/api/fires/:id', db.updateFire);
router.delete('/api/fires/:id', db.removeFire);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;