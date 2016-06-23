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
    var ct = req.get('Content-type');
    var request;
    if (ct === 'application/json') {
	    console.log("json: " + req.body);
	    request = req.body;

    } else if (ct === "application/x-www-form-urlencoded") {
	    reqStr = req.body.request;
	    var request = JSON.parse(req.body.request);
    }

    if (request !== undefined) {
	    console.log(request.user_id);
	    var initOpts = Learnosity.init(
			    'items',					/* service */
			    {
				    'consumer_key': '4OkIF4wLnpI9L40m',	/* security */
				    'domain': 'localhost',
				    'user_id': request.user_id
			    },
			    '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0',	/* secret */
			    request);

	    res.json(initOpts);

    } else {
	    res.send("Unknown content type for signer: " + ct);
    }
});

module.exports = router;
