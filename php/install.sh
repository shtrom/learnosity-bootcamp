#!/bin/sh
npm install
(cd public; ../node_modules/bower/bin/bower install bootstrap)
composer install
