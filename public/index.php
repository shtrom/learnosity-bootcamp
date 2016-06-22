<?php

require '../vendor/autoload.php';

use Learnosity\Bootcamp\Views\MainView;
use Symfony\Component\HttpFoundation\Request;

date_default_timezone_set('UTC');

$req = Request::createFromGlobals();
$mainView = new MainView;
$res = $mainView->render($req);
$res->prepare($req);
$res->send();