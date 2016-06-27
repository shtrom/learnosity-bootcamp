<?php
namespace Learnosity\Bootcamp\Views;

use Learnosity\Bootcamp\LearnosityApi;
use Symfony\Component\HttpFoundation\Response;

class ScrollingView
{
    public function render($userId, $sessionId)
    {
        $initOpts = LearnosityApi::items([
            'rendering_type' => 'inline',
            'user_id' => $userId,
            'session_id' => $sessionId,
            'type' => 'local_practice',
            'state' => 'initial',
            'items' => ['mfom_bootcamp_intro'],
            'config' => [
                'questionsApiVersion' => 'v2',
            ]
        ]);

        $page = $this->template($initOpts);

        return new Response(
            $page,
            Response::HTTP_OK,
            [
                'Content-Type' => 'text/html',
                'Content-Length' => strlen($page),
            ]
        );
    }

    private function template($initOpts)
    {
        ob_start();
        ?><!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Counting for the modern person</title>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
            <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
            <script src="https://code.jquery.com/jquery-3.0.0.min.js" integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0=" crossorigin="anonymous"></script>
        </head>

        <body>
        <div id="items">
            <span class="learnosity-item" data-reference="mfom_bootcamp_intro"></span>
        </div>

        <script src="//items.learnosity.com"></script>

        <script>
            var ITEM_API_INIT_OPTS = <?php echo $initOpts ?>;
        </script>

        <script src="/js/views/scrolling.js"></script>
        </body>
        </html><?php
        return ob_get_clean();
    }
}


 