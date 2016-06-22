<?php
namespace Learnosity\Bootcamp\Views;

use LearnositySdk\Request\Init;

class MainView
{
    public function render()
    {
        $sessionId = uniqid();
        $userId = uniqid();

        // Instantiate the SDK Init class with your security and request data:
        $init = new Init(
            'items',
            [
                'consumer_key' => '4OkIF4wLnpI9L40m',
                'domain'       => 'localhost',
                'user_id'      => $userId
            ],
            '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0',
            [
                'rendering_type'=> 'assess',
                'session_id'=>$sessionId,
                'user_id'=>$userId,
                'items' => [
                    'mfom_bootcamp_cats',
                    'mfom_bootcamp_poker',
                    'mfom_bootcamp_foosball',
                    'mfom_count_3',
                    'mfom_counting_2',
                ],
                'type'=>'local_practice',
                'state'=>'initial',
                'config' => [
                    'assessApiVersion' => 'v2',
                    'questionsApiVersion' => 'v2',
                    'title'=> 'Counting for the modern man',
                    'subtitle'=> 'A holistic approach',
                    'ui_style' => 'main',
                ]
            ]
        );

        // Call the generate() method to retrieve a JavaScript object
        $request = $init->generate();

        echo $this->template($request);
    }

    private function template($initOpts)
    {
        ob_start();
        ?><!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Counting bootcamp</title>
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

