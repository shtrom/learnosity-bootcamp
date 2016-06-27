<?php

require '../vendor/autoload.php';

use Learnosity\Bootcamp\Views\ReportView;
use Symfony\Component\HttpFoundation\Request;

date_default_timezone_set('UTC');

$req = Request::createFromGlobals();

$view= new ReportView;
$res = $view->render($req);
$res->prepare($req);
$res->send();
