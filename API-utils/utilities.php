<?php
/**
 * Get input data value.
 * @param string $index Index name.
 * @param string $default Default value.
 * @param string $type Type of request.
 * @return string $value Input value.
 */
function getInput($index, $default = '', $type = 'request') {
    switch ($type) {
        case 'post':
            return isset($_POST[$index]) ? $_POST[$index] : $default;

        case 'get':
            return isset($_GET[$index]) ? $_GET[$index] : $default;

        case 'request':
        default:
            return isset($_REQUEST[$index]) ? $_REQUEST[$index] : $default;
    }
}

/**
 * Print responses in JSON format.
 * @param array $responses List of data responses.
 * @return string $responses Responses in JSON format.
 */
function printResponses($responses) {
    die(json_encode($responses));
    exit;
}