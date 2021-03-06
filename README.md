Learnosity Bootcamp 2016
========================

This repository contains odds and ends built for our 2016 bootcamp at Learnosity.

We started with a Node.JS application using the Items API to render an Activity created in the Author site.

It was further extended to provide a service signing the request on the server side, so a static page can be served, getting the signature with an XHR.

We then moved to PHP, and reimpleted the Items API/Activity page.

We shifted our focus to an infinite-scrolling assessment, using the Data API to fetch all MCQs from the itembank, then rendering then as the user scrolls. At any point in time, the user is also able to obtain a report on their current performance.

Node.js documentation
---------------------

We use the Javascript SDK stub (in `lib/learnosity.dev.sdk.js`), which had to be altered slight so it can be used as a Node module.

The server can be run with

    npm install
    npm start

It will serve its content at http://localhost:3000 and offers two endpoints:

- [`/count`](http://localhost:3000/count) the assessment
- [`/sign`](http://localhost:3000/sign) the server-side request-signing (the request to sign should be `POST`ed as `request`)

PHP documentation
-----------------

The PHP code is in `php`. It can be run with

    ./install.sh
    ./start # alternatively, npm start also works

It will serve its content at http://localhost:8080 and offers a few endpoints:

- [`/`](http://localhost:8080/) the assessment
- [`/scrolling`](http://localhost:8080/scrolling.php) the infinite-scrolling assessment, also available at `/infinite`
- [`/data[?next=XXXX.XXXX][&limit=XXXX]`](http://localhost:8080/data.php) query the Data API for MCQs, in batches of 50; it takes some optional parameters (passed either on the query string or as a POST parameter):
  - `next`, obtained from the previous response `[meta]` object, to get the next elements in the IBK
  - `limit`, to limit the number of elements in one response (defaults to 50)
- [`/report?userid=XXX&sessid=XXXX`](http://localhost:8080/report.php?userid=brianmoser&sessid=014301f1-c6b4-411f-9b69-00508bb76bbf) provides a report on the performance of the session identified by `sessid`

Authors
-------

- Michael Fulthorp
- Olivier Mehani
