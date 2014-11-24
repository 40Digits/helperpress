<?php

namespace HelperPress\Libs;

class WP {

	public function __construct () {
	}

	// regenerates .htaccess
	public function flush_rewrite_rules () {
		global $wp_rewrite;

		require_once ABSPATH . 'wp-admin/includes/misc.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';

		$wp_rewrite->flush_rules(true);

		// great success
		http_response_code(200);
		exit;

	}


}