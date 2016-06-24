<?php
namespace Learnosity\Bootcamp\Views;

use LearnositySdk\Request\DataApi;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Console\Output\ConsoleOutput;


use Psr\Log\LoggerInterface;

class DataView
{
    private $output;

    private function handler($data) {
        $this->output->writeln(json_encode($data));
    }

    public function render()
    {
        $this->output = new ConsoleOutput();
	$security = [
	    'consumer_key' => '4OkIF4wLnpI9L40m',
	    'domain' => 'localhost',
	];
	$secret = '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0';
	$request = [
	    'limit' => 50,
            /* 'references' => [ 'bootcamp' ], */
            'summary' => true,
	];
	$action = 'get';


	$dataApi = new DataApi();
        $response = $dataApi->request(
	/* $response = $dataApi->requestRecursive( */
	    'https://data.learnosity.com/latest/itembank/items',
	    $security,
	    $secret,
	    $request,
	    $action//,
            /* function($data) { */
            /*     $this->handler($data); */
            /* } */
	);
        $this->output->writeln(json_encode($response));

	return new Response(
            $this->template($response),
	    Response::HTTP_OK,
	    ['content-type' => 'application/json']
	);
    }

    private function template($response)
    {
	ob_start();
        print(json_encode($response));
	return ob_get_clean();
    }
}

/*
 * vim: sw=4:expandtab
 */
