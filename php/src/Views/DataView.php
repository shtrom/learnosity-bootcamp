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

    public function render($req)
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
	    /* 'limit' => 1000, */
            'types' => ['mcq'],
            'summary' => true,
	];

        $next = 0;
        if ($req->query->get("next")) {
            $next = $req->query->get("next");
        } else if ($req->request->get("next")) {
            $next = $req->request->get("next");
        }
        if ($next != 0) {
            $request['next'] = $next;
        }

	$action = 'get';

	$dataApi = new DataApi();
        $response = $dataApi->request(
	/* $response = $dataApi->requestRecursive( */
	    'https://data.learnosity.com/latest/itembank/items',
	    $security,
	    $secret,
	    $request,
	    $action
            /* , */
            /* function($data) { */
            /*     $this->handler($data); */
            /* } */
	)->getBody();
        $jresp = json_decode($response);
        $this->output->writeln("supplied next: " . $next . ", " .
            sizeof($jresp->{'data'}) .
            " new items, next: " . $jresp->{'meta'}->{'next'});

	return new Response(
            $this->template($response),
	    Response::HTTP_OK,
	    ['content-type' => 'application/json']
	);
    }

    private function template($response)
    {
	ob_start();
        print($response);
	return ob_get_clean();
    }
}

/*
 * vim: sw=4:expandtab
 */
