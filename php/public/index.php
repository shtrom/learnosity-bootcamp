<?php

require '../vendor/autoload.php';

use Learnosity\Bootcamp\Views\MainView;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

date_default_timezone_set('UTC');

$req = Request::createFromGlobals();
$session = new Session;
$session->start();

if (!$session->has('userId')) {
    $session->set('userId', uniqid());
}
if (!$session->has('sessionId')) {
    $session->set('sessionId', uniqid());
}

$userId = $session->get('userId');
$sessionId = $session->get('sessionId');

$mainView = new MainView;
$res = $mainView->render($userId, $sessionId);
$res->prepare($req);
$res->send();