<?php
namespace Learnosity\Bootcamp\Views;

use LearnositySdk\Request\Init;

class MainView
{
    public function render()
    {
        $sessionId = uniqid();
        $userId = uniqid();

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

        echo $this->template($init->generate());
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
            <div id="learnosity_assess"></div>
            <a href="https://author.learnosity.com">Edit these questions</a>

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

