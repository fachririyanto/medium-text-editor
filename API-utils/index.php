<?php
/**
 * API for utilities.
 * @version 1.0.0
 * @author Fachri Riyanto
 */

/* set cross origin */
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');
header('Access-Control-Allow-Headers: X-Requested-With,content-type');
header('Access-Control-Allow-Credentials: true');

/* import utilities */
require_once('utilities.php');

/**
 * API class object.
 * This is used for render responses of request.
 * @author Fachri Riyanto
 * @version 1.0.0
 */
class API {

    /**
     * Render responses.
     * @return string $json Server responses.
     * @since 1.0.0
     */
    function render() {
        $action = getInput('action', '', 'get');

        switch ($action) {
            case 'GET_WEBSITE_DATA':
                require_once('lib/metadata/autoload.php');
                $url = getInput('url', '', 'get');
                $MetaData = new MetaData();
                $responses = $MetaData->get($url);
                break;

            default:
                $responses = array(
                    'status'  => true,
                    'message' => 'empty_action',
                    'data'    => array()
                );
        }

        // print responses
        printResponses($responses);
    }
}

// RUN API
$API = new API;
$API->render();