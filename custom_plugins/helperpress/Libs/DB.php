<?php

namespace HelperPress\Libs;

class DB {

	private $dumps_dir;
	private $imports_dir;

	public function __construct () {
		$this->init();
	}

    public function init () {
		$this->dumps_dir = HP_PRIVATE_DIR_PATH . '/dumps';
		$this->imports_dir = HP_PRIVATE_DIR_PATH . '/imports';

		// make the dirs if they don't exist
		$oldmask = umask(0);
		@mkdir($this->dumps_dir, 0777);
		@mkdir($this->imports_dir, 0777);
		umask($oldmask);
    }

	public function import_db ($filename) {

		$file_path = $this->imports_dir . '/' . $filename;

		try {
			// import it
			$this->_import_mysql_dump($file_path);

			// great success
			http_response_code(200);
			exit;

		} catch (\Exception $e){
			http_response_code(500);
			die($e->getMessage());
		}

	}

	public function dump_db () {
		include(HP_BASE_PATH . '/vendor/mysqldump-php/src/Ifsnop/Mysqldump/Mysqldump.php');

		$file_path = $this->dumps_dir . '/' . date('Y-m-d--H-m-s') . '.sql';

		try {
			// do the dump
			$dump_args = array(
			    'add-drop-table' => true,
			    'single-transaction' => false
			);
			$dump = new \Ifsnop\Mysqldump\Mysqldump( DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, 'mysql', $dump_args);
			$dump->start($file_path);

			// great success
			http_response_code(200);

			// get file path relative to WP root dir
			$rel_file_path = 'wp-content' . substr($file_path, strpos($file_path, WP_CONTENT_DIR) + strlen(WP_CONTENT_DIR)); 
			echo $rel_file_path;
			exit;
		} catch (\Exception $e) {
			http_response_code(500);
			die($e->getMessage());
		}
	}

	// taken from http://stackoverflow.com/questions/19751354/how-to-import-sql-file-in-mysql-database-using-php
	private function _import_mysql_dump($filename){
		
		$mysql_host = DB_HOST;
		$mysql_username = DB_USER;
		$mysql_password = DB_PASSWORD;
		$mysql_database = DB_NAME;

		// Connect to MySQL server
		if(false === @mysql_connect($mysql_host, $mysql_username, $mysql_password))
			throw new \Exception('Error connecting to MySQL server: ' . mysql_error());

		// Select database
		if(false === @mysql_select_db($mysql_database))
			throw new \Exception('Error selecting MySQL database: ' . mysql_error());
		

		// Temporary variable, used to store current query
		$templine = '';

		// Read in entire file
		$lines = @file($filename);
		if(false === $lines)
			throw new \Exception('File "' . $filename . '" could not be opened.');

		// Loop through each line
		foreach ($lines as $line)
		{
			// Skip it if it's a comment
			if (substr($line, 0, 2) == '--' || $line == '')
				continue;

			// Add this line to the current segment
			$templine .= $line;

			// If it has a semicolon at the end, it's the end of the query
			if (substr(trim($line), -1, 1) == ';')
			{
				// Perform the query
				if(false === mysql_query($templine))
					throw new \Exception('Error performing query \'<strong>' . $templine . '\': ' . mysql_error() );

				// Reset temp variable to empty
				$templine = '';
			}
		}
	}


}