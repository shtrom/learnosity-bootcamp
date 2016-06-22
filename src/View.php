<?php
namespace Learnosity\Bootcamp;

use Symfony\Component\HttpFoundation\Response;

interface View
{
    /**
     * @return Response
     */
    public function render();
}