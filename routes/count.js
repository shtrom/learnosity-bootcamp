var express = require('express');

var router = express.Router();

var Learnosity = require("../lib/learnosity.dev.sdk");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('count', { title: 'Counting for the modern person' } );
});

module.exports = router;
