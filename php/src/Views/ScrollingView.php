<?php
namespace Learnosity\Bootcamp\Views;

use Learnosity\Bootcamp\LearnosityApi;
use Symfony\Component\HttpFoundation\Response;

class ScrollingView
{
    public function render($userId, $sessionId)
    {
        $initOpts = LearnosityApi::items([
            'activity_id' => 'mfom_bootcamp_infinite_inquisition',
            'name' => 'Infinite Inquisition',
            'rendering_type' => 'inline',
            'user_id' => $userId,
            'session_id' => $sessionId,
            'type' => 'submit_practice',
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
            <title>Infinite Inquisition</title>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
            <script   src="https://code.jquery.com/jquery-2.2.4.min.js"   integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="   crossorigin="anonymous"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
            <script src="http://momentjs.com/downloads/moment.js"></script>
            <style>
                .overlay {
                    height: 100%;
                    width: 100%;
                    position: fixed;
                    z-index: 2;
                    left: 0;
                    top: 0;
                    background-color: rgba(255,255,255,0.6);
                    overflow-x: auto;
                }

                .overlay-content {
                    margin: 10% auto;
                    width: 40%;
                    background-color: #fff;
                    text-align: center;
                    border-radius: 5px;
                    border: 1px solid #aaa;
                    padding: 1em;
                }

                .clock {
                    position: fixed;
                    right: 0;
                    top: 0;
                    background-color: #fff;
                    z-index: 1;
                    padding: 1em;
                    border-radius: 5px;
                    border: 1px solid #aaa;
                }

                #items {
                    margin-top: 10%;
                }
            </style>
        </head>

        <body>
            <div id="start" class="overlay">
                <div class="overlay-content">
                    <span class="learnosity-item" data-reference="mfom_bootcamp_intro"></span>
                    <button id="start-button" class="btn btn-default">Start</button>
                </div>
            </div>

            <div id="end" class="overlay" style="display:none">
                <div class="overlay-content">
                    <h1>Time's up!</h1>
                    <button id="results-button" class="btn btn-default">Results</button>
                </div>
            </div>

            <div class="clock">
                <h2>Time Remaining <span id="clock">0:00</span></h2>
            </div>

            <div id="items"></div>

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


 
