<?php

namespace HelperPress\Libs;

use \HelperPress\Libs\Controllers\Admin;

class Plugin {

    public static function activate () {

    }

    public static function deactivate () {

    }

    public static function initiate () {

    }

    public static function load_scripts () {

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