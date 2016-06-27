<?php
namespace Learnosity\Bootcamp\Views;

use LearnositySdk\Request\Init;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Console\Output\ConsoleOutput;

class ReportView
{
    private $output;

    public function render($req)
    {
        $this->output = new ConsoleOutput();

        if ($req->query->get("userid")) {
            $userid = $req->query->get("userid");
        } else if ($req->request->get("userid")) {
            $userid = $req->request->get("userid");
        }

        if ($req->query->get("sessid")) {
            $sessid = $req->query->get("sessid");
        } else if ($req->request->get("sessid")) {
            $sessid = $req->request->get("sessid");
        }

        $this->output->writeln("Requesting report for userid " . $userid . ", sessid " . $sessid);

        if (!isset($sessid) || !isset($userid)) {
            return new Response(
                $this->error(),
                Response::HTTP_OK,
                ['content-type' => 'text/html']
            );
        }

        $init = new Init(
            'reports',
            [
                'consumer_key' => '4OkIF4wLnpI9L40m',
                'domain' => 'localhost',
            ],
            '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0',
            [
                "reports" => [
                    [
                        'id' => 'other-sessions',
                        'type' =>  'sessions-list',
                        'limit' => 10,
                        'users' => [
                            [
                                'id' => $userid,
                                'name' => $userid,
                            ]
                        ],
                    ],
                    [
                        'id' => 'scrolling-report',
                        'type' => 'session-detail-by-question',
                        'user_id' => $userid,
                        'session_id' => $sessid,
                    ],
                ],
            ]
        );

        return new Response(
            $this->template($init->generate(), $userid, $sessid),
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
    }

    private function template($initOpts, $userid, $sessid)
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
            <h1>Report for <?php print($userid); ?>'s session <?php print($sessid); ?></h1>
            <div id="scrolling-report"></div>
            <h2>All known sessions for <?php print($userid); ?></h2>
            <div id="other-sessions"></div>

            <script src="//reports.learnosity.com"></script>

            <script>
                var initOpts = <?php echo $initOpts ?>;
                var reportsApp = LearnosityReports.init(initOpts,
                    {
                        readyListener: onReportsReady
                    }
                );

                function onReportsReady() {
                    var sessList = reportsApp.getReport("other-sessions");
                    sessList.on('click:session', function (data) {
                        console.log(
                            'A session in the report was clicked: ' + data.session_id
                        );
                        window.location = window.location.protocol + "//" + window.location.host + window.location.pathname +  "?userid=<?php print($userid); ?>&sessid=" + data.session_id;
                    });
                }
            </script>
        </body>
        </html><?php
        return ob_get_clean();
    }

    private function error()
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
                <h1>400 Bad Request: Missing parameters</h1>
                <p>This endpoint requires parameters <tt>userid</tt> and <tt>sessid</tt>.</p>
        </body>
        </html><?php
        return ob_get_clean();
    }
}

/*
 * vim: sw=4:expandtab
 */
