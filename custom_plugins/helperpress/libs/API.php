<?php

namespace HelperPress\Libs;

class API {

	// the current key
	private $key;

	// path to our key file
	private $key_file = HP_PRIVATE_DIR_PATH . '/api_key.txt';


    // get current key
    private function get_key () {
    	if(empty($this->key))
    		$this->load_key();

    	return $this->key;
    }
    
	// generate random API key
    private function generate_key () {
    	$new_key = bin2hex(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));

    	file_put_contents($this->key, $new_key);

    	return $new_key;
    }

    // load key from txt file
    private function load_key () {
    	$key = @file_get_contents($this->key_file);

    	if($key === false)
    		$key = $this->generate_key();

    	$this->key = $key;
    }

    // check if $key is correct
    private function verify_key ($key) {
    	return $key == $this->get_key();
    }

    // hide uploads helperpress dir from the web
    public function protect_helperpress_directory () {

		$htaccess_content = <<<EOD
# BEGIN HelperPress Directory Protection
Order Allow,Deny
Deny from all
# END HelperPress Directory Protection
EOD;

		// write .htaccess file
		file_put_contents(HP_PRIVATE_DIR_PATH . '/.htaccess', $htaccess_content);

    }

}