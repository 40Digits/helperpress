<?php

namespace HelperPress\Libs;

class DB {

    public function import_db ($filename) {

    	$this->_import_mysql_dump($filename);

		//TODO return good news header
    }

    public function dump_db () {
		include(HP_BASE_PATH . '/vendor/mysqldump-php/src/Ifsnop/Mysqldump/Mysqldump.php');

		$dump_path = HP_PRIVATE_DIR_PATH . '/dumps/' . date('Y-m-d--H-m-s.sql');

		$dump = new Ifsnop\Mysqldump\Mysqldump( DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, 'mysql');
	    $dump->start('/dump.sql');

	    //TODO return good news header
	   	echo $dump_path;
    }

	// taken from http://stackoverflow.com/questions/19751354/how-to-import-sql-file-in-mysql-database-using-php
    private function _import_mysql_dump($filename){
    	
    	$mysql_host = DB_HOST;
    	$mysql_username = DB_USER;
    	$mysql_password = DB_PASSWORD;
    	$mysql_database = DB_NAME;

		// Connect to MySQL server
		mysql_connect($mysql_host, $mysql_username, $mysql_password) or die('Error connecting to MySQL server: ' . mysql_error());

		// Select database
		mysql_select_db($mysql_database) or die('Error selecting MySQL database: ' . mysql_error());

		// Temporary variable, used to store current query
		$templine = '';

		// Read in entire file
		$lines = file($filename);

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
			    mysql_query($templine) or print('Error performing query \'<strong>' . $templine . '\': ' . mysql_error() . '<br /><br />');

			    // Reset temp variable to empty
			    $templine = '';
			}
		}
	}


}