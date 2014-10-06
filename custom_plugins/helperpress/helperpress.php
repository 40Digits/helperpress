<?php
/*
Plugin Name: HelperPress
Plugin URI: http://www.40digits.com
Description: The WP plugin component for the HelperPress toolbelt.
Version: 0.1
Author: 40Digits
License: MIT
*/

require_once('constants.php');
require_once('helpers/utils.php');
require_once('autoload.php');


/*
    Setup Actions/Hooks
*/
add_action('init', array('\HelperPress\Libs\Plugin', 'initiate'));
add_action('admin_enqueue_scripts', array('\HelperPress\Libs\Controllers\Admin', 'load_scripts'));
add_action('wp_enqueue_scripts', array('\HelperPress\Libs\Plugin', 'load_scripts'));

// Administration Menu
add_action('admin_menu', array('\HelperPress\Libs\Plugin', 'install_admin_panel'));

// Plugin Install/Uninstall hooks
register_activation_hook(__FILE__, array('\HelperPress\Libs\Plugin', 'activate') );
register_deactivation_hook(__FILE__, array('\HelperPress\Libs\Plugin', 'deactivate'));