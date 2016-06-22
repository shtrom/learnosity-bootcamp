var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var assessInit = "fill me";
  res.render('index', { title: 'test', assessInit: assessInit });
});

module.exports = router;
