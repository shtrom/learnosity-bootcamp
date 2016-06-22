var express = require('express');
var router = express.Router();

var Learnosity = require("../lib/learnosity.dev.sdk");

/* GET home page. */
router.get('/', function(req, res, next) {
    var service = 'questions',
    security = {
        'consumer_key': 'yis0TYCu7U9V4o7M',
        'user_id': 'demo_student'
    },
    secret = '74c5fd430cf1242a527f6223aebd42d30464be22',
    request = {
        'type': 'local_practice',
        'state': 'initial',
        'questions': [{
            "response_id": "60001",
            "type": "formula_dev",
            "instant_feedback": true,
            "is_math": true,
            "stimulus": "<h4>Q1. Expand the equation \\((x + 7) ( x-3)\\)</h4>",
            "ui_style": {
                "type": "block-keyboard"
            },
            "validation": {
                "scoring_type": "exactMatch",
                "valid_response": {
                    "score": 1,
                    "value": [{
                        "method": "equivSymbolic",
                        "value": "x^2+4x-21",
                        "options": {
                            "allowDecimal": false,
                            "inverseResult": false
                        }
                    }]
                }
            }
        }, {
            "response_id": "60002",
            "type": "shorttext",
            "case_sensitive": true,
            "instant_feedback": true,
            "stimulus": "<h4>Q2. What is the capital of Ireland?</h4>",
            "validation": {
                "scoring_type": "exactMatch",
                "valid_response": {
                    "score": 1,
                    "value": "Dublin"
                },
                "alt_responses": [{
                    "score": 2,
                    "value": "Dubh Linn"
                }, {
                    "score": 3,
                    "value": "Baile Átha Cliath"
                }, {
                    "score": 4,
                    "value": "Baile Atha Cliath"
                }]
            }
        }]
    };
    var assessInit = Learnosity.init(service, security, secret, request);

    res.render('index', { title: 'test', assessInit: assessInit });
});

module.exports = router;
