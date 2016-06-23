var express = require('express');
var uuid = require('uuid');

var router = express.Router();

var Learnosity = require("../lib/learnosity.dev.sdk");

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req);
    session_id = uuid.v4();
    user_id = uuid.v4();
    res.render('sign', { title: 'Request signing', user_id: user_id, session_id: session_id });
});
router.post('/', function(req, res, next) {
    b = req.body;
    var request = JSON.parse(b.request);
    // var request = JSON.parse('{ "user_id": 2 }');
    // res.send(request.request);
    var initOpts = Learnosity.init(
        'items',					/* service */
	{
            'consumer_key': '4OkIF4wLnpI9L40m',		/* security */
            'domain': 'localhost',
            'user_id': request.user_id
        },
        '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0',	/* secret */
        request);

    res.json(initOpts);
});

module.exports = router;
