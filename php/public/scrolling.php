<?php

require '../src/bootstrap.php';

use Learnosity\Bootcamp\Views\ScrollingView;
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

$view = new ScrollingView();
$res = $view->render($userId, $sessionId);
$res->prepare($req)
    ->send();