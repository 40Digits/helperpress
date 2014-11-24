<?php

namespace HelperPress\Libs;

class Plugin {

    public static function initiate () {

        // See if we need to activate. This sometimes get skipped due to migration
        if(!file_exists(HP_PRIVATE_DIR_PATH))
            self::activate();

        // Routes & Request Vars 
        add_action( 'query_vars', array('\HelperPress\Libs\Routes', 'add_query_vars') );
        add_action( 'template_redirect', array('\HelperPress\Libs\Routes', 'route_handler') );

    }

    public static function activate () {
        // Create and protect HP private dir
        @mkdir(HP_PRIVATE_DIR_PATH);
        
        $api = new \HelperPress\Libs\API;
        $api->init();

        $db = new \HelperPress\Libs\DB;
        $db->init();
    }

    public static function deactivate () {
        // delete that private dir of your shiz
    }

    public static function load_scripts () {
        // loads scripts on frontend--sooooo you shouldn't need this function
    }

    public static function install_admin_panel () {
        add_menu_page(
            "HelperPress",
            "HelperPress",
            "administrator",
            "hp-menu",
            array('\HelperPress\Libs\Controllers\Admin', 'index')
        );

        add_action("admin_head", array('\HelperPress\Libs\Controllers\Admin', 'header'));
        add_action("admin_foot", array('\HelperPress\Libs\Controllers\Admin', 'footer'));
    }

}