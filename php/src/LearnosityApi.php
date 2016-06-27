<?php
namespace Learnosity\Bootcamp;

use LearnositySdk\Request\DataApi;
use LearnositySdk\Request\Init;

class LearnosityApi
{

    const CONSUMER_KEY = '4OkIF4wLnpI9L40m';
    const CONSUMER_SECRET = '84468e36ee4d3bfea6f57fca1e2db3a5a00fa8e0';
    const DOMAIN = 'localhost';
    const DATA_API_BASE_URL = 'https://data.learnosity.com/latest';

    public static function items($req)
    {
        $userId = $req['user_id'];

        $init = new Init(
            'items',
            [
                'consumer_key' => self::CONSUMER_KEY,
                'domain' => self::DOMAIN,
                'user_id' => $userId
            ],
            self::CONSUMER_SECRET,
            $req
        );

        return $init->generate();
    }

    public static function questions($req)
    {
        $userId = $req['user_id'];

        $init = new Init(
            'questions',
            [
                'consumer_key' => self::CONSUMER_KEY,
                'domain' => self::DOMAIN,
                'user_id' => $userId,
            ],
            self::CONSUMER_SECRET,
            $req
        );

        return $init->generate();
    }

    public static function data($action, $endpoint, $req)
    {
        $url = self::DATA_API_BASE_URL . '/' . $endpoint;
        $dataApi = new DataApi();
        $res = $dataApi->request(
            $url,
            [
                'consumer_key' => self::CONSUMER_KEY,
                'domain' => self::DOMAIN,
            ],
            self::CONSUMER_SECRET,
            $req,
            $action
        );

        return $res;
    }
}