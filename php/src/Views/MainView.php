<?php
namespace Learnosity\Bootcamp\Views;

use Learnosity\Bootcamp\LearnosityApi;
use Symfony\Component\HttpFoundation\Response;

class MainView
{
    public function render($userId, $sessionId)
    {
        $initOpts = LearnosityApi::items([
            'rendering_type' => 'assess',
            'user_id'=>$userId,
            'session_id' => $sessionId,
            'activity_template_id' => 'mfom_bootcamp',
            'type' => 'local_practice',
            'state' => 'initial',
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
            <div id="learnosity_assess"></div>

            <a href="https://author.learnosity.com/org/1/activity/516294/edit">Edit these questions</a>

            <script src="//items.learnosity.com"></script>

            <script>
                var initOpts = <?php echo $initOpts ?>;
                var itemsApp = LearnosityItems.init(initOpts);
            </script>
        </body>
        </html><?php
        return ob_get_clean();
    }
}

