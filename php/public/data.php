<?php

require '../vendor/autoload.php';

use Learnosity\Bootcamp\Views\DataView;

date_default_timezone_set('UTC');

$view= new DataView;
$res = $view->render();
$res->prepare($req);
$res->send();
