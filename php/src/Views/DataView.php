<?php
namespace Learnosity\Bootcamp\Views;

use LearnositySdk\Request\DataApi;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Console\Output\ConsoleOutput;


use Psr\Log\LoggerInterface;

class DataView
{
    private function handler($data) {
        $output = new ConsoleOutput();
        $output->writeln(json_encode($data));
    }

    public function render()
    {
	$security = [
	    'consumer_key' => '4OkIF4wLnpI9L40m',
	    'domain' => 'localhost',
	];
	$secret = '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0';
	$request = [
	    'limit' => 1,
	    'types' => ['unit', 'module'],
	];
	$action = 'get';


	$dataApi = new DataApi();
	$dataApi->requestRecursive(
	    'https://data.learnosity.com/latest/itembank/items',
	    $security,
	    $secret,
	    $request,
	    $action,
            function($data) {
                $this->handler($data);
            }
	);

	return new Response(
            $this->template(),
	    Response::HTTP_OK,
	    ['content-type' => 'application/json']
	);
    }

    private function template()
    {
	ob_start();
        ?>
	    { "done": true }
<?php
	return ob_get_clean();
    }
}

/*
 * vim: sw=4:expandtab
 */
