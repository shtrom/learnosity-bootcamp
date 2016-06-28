<?php

require '../src/bootstrap.php';

use Learnosity\Bootcamp\Views\ScrollingView;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Request;

$req = Request::createFromGlobals();

$userId = Uuid::uuid4()->toString();
$sessionId = Uuid::uuid4()->toString();

$view = new ScrollingView();
$res = $view->render($userId, $sessionId);
$res->prepare($req)
    ->send();