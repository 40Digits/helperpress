<?php

namespace HelperPress\Libs;

class Plugin {

    public static function initiate () {

        // See if we need to activate. This sometimes get skipped due to migration
        if(!file_exists(HP_PRIVATE_DIR_PATH))
            $this->activate();

        // Routes & Request Vars
        add_action( 'init', array('\HelperPress\Libs\Controllers\Routes', 'add_rewrite_rules') );  
        add_action( 'query_vars', array('\HelperPress\Libs\Controllers\Routes', 'add_query_vars') );
        add_action( 'template_redirect', array('\HelperPress\Libs\Controllers\Routes', 'route_handler') );

    }

    public static function activate () {
        // This is where you create that private directory for your shiz
        mkdir(HP_PRIVATE_DIR_PATH);

        \HelperPress\Libs\API::protect_helperpress_directory();

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