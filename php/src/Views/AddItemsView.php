<?php
namespace Learnosity\Bootcamp\Views;

use Learnosity\Bootcamp\LearnosityApi;
use Symfony\Component\HttpFoundation\Response;

class AddItemsView
{
    public function render($userId, $sessionId)
    {
        $initOpts = LearnosityApi::items([
            'rendering_type' => 'inline',
            'user_id' => $userId,
            'session_id' => $sessionId,
            'type' => 'local_practice',
            'state' => 'initial',
            'items' => ['mfom_bootcamp_cats'],
            'config' => [
                'questionsApiVersion' => 'v2',
            ]
        ]);

        return new Response(
            $this->template($initOpts),
            Response::HTTP_OK,
            ['content-type' => 'text/html']
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
        </head>

        <body>
        <div id="items">
            <span class="learnosity-item" data-reference="mfom_bootcamp_cats"></span>
        </div>

        <script src="//items.learnosity.com"></script>

        <script>
            var ITEM_API_INIT_OPTS = <?php echo $initOpts ?>;
        </script>

        <script src="/js/views/add-items.js"></script>
        </body>
        </html><?php
        return ob_get_clean();
    }
}


