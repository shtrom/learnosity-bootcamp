<?php

require '../src/bootstrap.php';

use Learnosity\Bootcamp\Views\AddItemsView;
use Learnosity\Bootcamp\Views\DataView;
use Learnosity\Bootcamp\Views\MainView;
use Learnosity\Bootcamp\Views\ReportView;
use Learnosity\Bootcamp\Views\ScrollingView;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Request;

$infinite = function () {
    $userId = Uuid::uuid4()->toString();
    $sessionId = Uuid::uuid4()->toString();

    $view = new ScrollingView();
    return $view->render($userId, $sessionId);
};

$counting = function () {
    $userId = Uuid::uuid4()->toString();
    $sessionId = Uuid::uuid4()->toString();

    $view = new MainView;
    return $view->render($userId, $sessionId);
};

$report = function ($req) {
    $view = new ReportView;
    return $view->render($req);
};

$data = function ($req) {
    $view= new DataView;
    return $view->render($req);
};

$addItems = function ($req) {
    $userId = Uuid::uuid4()->toString();
    $sessionId = Uuid::uuid4()->toString();

    $view = new AddItemsView();
    return $view->render($userId, $sessionId);
};

$routes = [
    'counting' => $counting,
    'infinite' => $infinite,
    'scrolling' => $infinite,
    'report' => $report,
    'data' => $data,
    'add-items' => $addItems,
];


$req = Request::createFromGlobals();

$route = substr($req->getPathInfo(), 1);

if (isset($routes[$route])) {
    $res = $routes[$route]($req);
} else {
    $res = $routes['counting']($req);
}

$res->prepare($req)
    ->send();
