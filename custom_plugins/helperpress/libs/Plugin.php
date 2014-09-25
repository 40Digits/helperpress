<?php

namespace HelperPress\Libs;

use \HelperPress\Libs\Controllers\Admin;

class Plugin {

    public static function activate () {
        // This is where you create that private directory for your shiz
    }

    public static function deactivate () {
        // delete that private dir of your shiz
    }

    public static function initiate () {
        // define your WP routes/rewrites here
    }

    public static function load_scripts () {
        // loads scripts on frontend--sooooo you shouldn't need this function
    }

    public static function install_admin_panel () {
        add_menu_page(
            "Helper Press",
            "Helper Press",
            "administrator",
            "hp-menu",
            array('\HelperPress\Libs\Controllers\Admin', 'index')
        );

        add_action("admin_head", array('\HelperPress\Libs\Controllers\Admin', 'header'));
        add_action("admin_foot", array('\HelperPress\Libs\Controllers\Admin', 'footer'));
    }

}