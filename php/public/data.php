<?php

require '../vendor/autoload.php';

use Learnosity\Bootcamp\Views\DataView;
use Symfony\Component\HttpFoundation\Request;

date_default_timezone_set('UTC');

$req = Request::createFromGlobals();

$view= new DataView;
$res = $view->render();
$res->prepare($req);
$res->send();
