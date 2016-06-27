var express = require('express');

var router = express.Router();

var Learnosity = require("../lib/learnosity.dev.sdk");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Bootcamp' });
});

module.exports = router;
