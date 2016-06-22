<?php
namespace Learnosity\Bootcamp;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

interface View
{
    /**
     * @param Request $req
     * @return Response
     */
    public function render(Request $req);
}