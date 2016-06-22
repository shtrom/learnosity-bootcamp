<?php
namespace Learnosity\Bootcamp\Views;

use LearnositySdk\Request\Init;
use Symfony\Component\HttpFoundation\Response;

class MainView
{
    public function render($userId, $sessionId)
    {
        $init = new Init(
            'items',
            [
                'consumer_key' => '4OkIF4wLnpI9L40m',
                'domain' => 'localhost',
                'user_id' => $userId
            ],
            '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0',
            [
                'rendering_type' => 'assess',
                'session_id' => $sessionId,
                'user_id' => $userId,
                'activity_template_id' => 'mfom_bootcamp',
                'type' => 'local_practice',
                'state' => 'initial',
            ]
        );

        return new Response(
            $this->template($init->generate()),
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
            <title>Counting bootcamp</title>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
            <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        </head>

        <body>
            <a href="https://author.learnosity.com/org/1/activity/516294/edit">Edit these questions</a>
            <div id="learnosity_assess"></div>

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

