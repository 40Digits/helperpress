<?php

namespace HelperPress\Libs;

class Routes {


    public static function add_query_vars( $public_query_vars ) {
        $public_query_vars[] = 'helperpress_api_key';
        $public_query_vars[] = 'helperpress_action';
        $public_query_vars[] = 'helperpress_arg';
        return $public_query_vars;
    }


    // Route handler
    public static function route_handler() {

        $action = get_query_var('helperpress_action');
        $api = new \HelperPress\Libs\API();


        if(empty($action))
            return;

        $key = get_query_var('helperpress_api_key');
        $arg = get_query_var('helperpress_arg');

        // check the key
        if(!$api->verify_key($key)){
            \http_response_code(401);
            die('Bad auth key');
        }

        $db = new \HelperPress\Libs\DB();
        $wp = new \HelperPress\Libs\WP();

        if (method_exists($db, $action)) {
            call_user_func_array(array($db, $action), array($arg));
        }else if (method_exists($wp, $action)) {
            call_user_func_array(array($wp, $action), array($arg));
        }else{
            \http_response_code(501);
            die('Action does not exist');
        }
        
    }

}