<?php

namespace HelperPress\Libs\Controllers;

class HelperPress {

    private $db = new \HelperPress\Libs\DB();
    private $api = new \HelperPress\Libs\API();

    public function import_db ($api_key, $file_name) {
        $this->authorize($api_key);
    }

    public function dump_db ($api_key) {
        $this->authorize($api_key);
    }

    private function authorize ($api_key) {
        if (!$this->api->verify_key($key)) {
            // Unauthorized
            // Return error 403
        }

        return true;
    }

}