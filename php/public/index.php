<?php

require '../src/bootstrap.php';

use Learnosity\Bootcamp\Views\MainView;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

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

$view = new MainView;
$res = $view->render($userId, $sessionId);
$res->prepare($req);
$res->send();