var httpsync = require('httpsync'),
	fs = require('fs');

module.exports = function(grunt){


	grunt.registerMultiTask('hp_wp_plugin', 'Interact with the HelperPress Wordpress Plugin.', function() {
		
		var options = this.options({
			method: '',
			environment: '<%= helperpress.db_master %>',
		});

		// base URL for API request
		var urlBase = 'http://' + grunt.config('helperpress.environments.' + options.environment + '.home_url') + '/';

		// get api key
		var apiKey = grunt.config('helperpress.environments.' + options.environment + '.hp_wp_api_key');

		// check config key
		if(typeof apiKey !== 'string'){
			return _fetchApiKey.call(this, options.environment);
		}

		// build and execute the request
		var req, resp,
			endPoint = urlBase + '?helperpress_api_key=' + apiKey;

		endPoint += '&helperpress_action=' + options.method;

		if(options.method == 'import_db'){
			endPoint += '&helperpress_arg=' + options.file;
		}

		// connect
		grunt.log.verbose('Connecting to ' + endPoint);

		req = httpsync.get(endPoint);
		resp = req.end();

		switch(resp.statusCode){

			// success
			case 200:
				grunt.log.verbose('Success. Response: ' + resp.data);
				break;

			// incorrect key
			case 401:
				grunt.log.verbose('Incorrect key. Removing saved key and fetching again.');
				return _fetchApiKey.call(this, options.environment);
				break;

			// incorrect key
			case 500:
				grunt.fatal('500 Error: ' + resp.data);
				break;

			default:
				grunt.fatal(resp.statusCode + ' Error. HelperPress WP Plugin is probably either not activated or not installed.');
				break;

		}

		switch(options.method){
			case 'dump_db':
				// save db dump name 
				grunt.config('helperpress.environments.' + options.environment + '._db_dump', String(resp.data));
				break;

			case 'import_db':
				// report success
				grunt.log.ok('Successfully imported database dump!');
				break;
		}
	});

	function _fetchApiKey(environment){
		// let's get it from the server via sftp
		grunt.task.run('get_hp_wp_plugin_api_key:' + environment);

		// and try it all again.
		grunt.task.run(this.nameArgs);
		return;
	}


	grunt.registerTask('get_hp_wp_plugin_api_key', 'Get the HelperPress Wordpress Plugin\'s API Key for the specified environment', function(environment) {

		var sftpOpts = {
				srcBasePath: '<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/_helperpress/',
				destBasePath: './db/',
				mode: 'download'
			},
			sftpFiles = {},
			tempApiKeyFilename = environment + '_api_key.txt',
			tempApiKeyFilePath = sftpOpts.destBasePath + tempApiKeyFilename;

		// check if the downloaded api key is present
		if(!fs.existsSync(tempApiKeyFilePath)){

			//let's download it then!
			var sftpCredsHelper = require('../lib/sftp-creds-helper')(grunt);
			
			sftpOpts = sftpCredsHelper(environment, sftpOpts);
			sftpFiles[tempApiKeyFilename] = 'api_key.txt';

			grunt.config('sftp.' + environment + '_get_api_key', {
				options: sftpOpts,
				files: sftpFiles
			});

			grunt.task.run('sftp:' + environment + '_get_api_key');

			// now that we're going to have the API key, let's run this task again
			grunt.task.run('get_hp_wp_plugin_api_key:' + environment);

			// we'll be back..
			return;

		}

		// since we have the key, save it in helperpress.local.json
		var theApiKey = grunt.file.read(tempApiKeyFilePath),
			configSettings = {
				environments: {}
			};

		configSettings.environments[environment] = {
			hp_wp_api_key: theApiKey
		};

		grunt.config('write_helperpress_config.' + environment + '_update_api_key', {
			options: {
				type: 'local',
				settings: configSettings
			}
		});
		grunt.task.run('write_helperpress_config:' + environment + '_update_api_key');

	});
};