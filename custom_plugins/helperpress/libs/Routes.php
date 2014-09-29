<?php

namespace HelperPress\Libs;

class Plugin {

    // Hooks
    public static function add_rewrite_rules() {  
        add_rewrite_rule(  
            "_helperpress/([^/]+)/([^/]+)/([^/]+)/",  
            'index.php?helperpress_api_key=$matches[1]&helperpress_action=$matches[2]&helperpress_arg=$matches[2]',
            'top');
    }

    public static function add_query_vars( $public_query_vars ) {
        $public_query_vars[] = 'helperpress_api_key';
        $public_query_vars[] = 'helperpress_action';
        $public_query_vars[] = 'helperpress_arg';
        return $public_query_vars;
    }


    // Route handler
    public static function route_handler() {
        $action = get_query_var('helperpress_action');

        if(empty($action))
            return;

        $key = get_query_var('helperpress_api_key');
        $arg = get_query_var('helperpress_arg');

        // check the key
        if(!\HelperPress\Libs\API::verify_key($key)){
            // TODO: send bad auth header
            echo 'key is incorrect';
            exit;
        }

        switch($action){
            case 'import_db':
                \HelperPress\Libs\DB::import_db($arg);
                break;

            case 'dump_db':
                \HelperPress\Libs\DB::import_db();
                break;
        }
        
    }

}