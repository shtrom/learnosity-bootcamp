var express = require('express');
var uuid = require('uuid');

var router = express.Router();

var Learnosity = require("../lib/learnosity.dev.sdk");

/* GET home page. */
router.get('/', function(req, res, next) {
    var userId = uuid.v4();
    var sessionId = uuid.v4();
    var initOpts = Learnosity.init(
        'items',
        {
            'consumer_key': '4OkIF4wLnpI9L40m',
            'domain': 'localhost',
            'user_id': userId
        },
        '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0',
        {
            'rendering_type': 'assess',
            'session_id': sessionId,
            'user_id': userId,
            'activity_template_id': 'mfom_bootcamp',
            'type': 'local_practice',
            'state': 'initial'
        });

    res.render('index', { title: 'Counting for the modern man', initOpts: JSON.stringify(initOpts) });
});

module.exports = router;
