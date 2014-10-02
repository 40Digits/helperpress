var httpsync = require('httpsync'),
	fs = require('fs');

module.exports = function(grunt){

	var curGruntTasks;


	grunt.registerTask('get_hp_wp_plugin_api_key', 'Get the HelperPress Wordpress Plugin\'s API Key for the specified environment', function(environment) {

		var sftpOpts = {
				srcBasePath: '<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/_helperpress/',
				destBasePath: './db/',
				mode: 'download'
			},
			tempApiKeyFilename = environment + '_api_key.txt',
			tempApiKeyFilePath = sftpOpts.srcBasePath + tempApiKeyFilename;

		// check if the downloaded api key is present
		if(!fs.existsSync(tempApiKeyFilePath)){

			//let's download it then!
			var sftpCredsHelper = require('./sftp-creds-helper')(grunt);
			
			sftpOpts = sftpCredsHelper(environment, sftpOpts);

			grunt.config('sftp.' + environment + '_get_api_key', {
				options: sftpOpts,
				files: { 'api_key.txt': tempApiKeyFilename }
			});

			grunt.task.run('sftp:' + environment + '_get_api_key');

			// now that we're going to have the API key, let's run this task again
			grunt.task.run('get_hp_wp_plugin_api_key:' + environment);

			// we'll be back..
			return;

		}

		// since we have the key, save it in helperpress.local.json
		var theApiKey = grunt.file.read(tempApiKeyFilePath);

		grunt.config('write_helperpress_config.' + environment + '_update_api_key', {
			options: {
				type: 'local',
				settings: {
					'hp_wp_api_key': theApiKey
				}
			}
		});
		grunt.task.run('write_helperpress_config.' + environment + '_update_api_key');

	});


		
	var HpWpPlugin = function(environment){
		this.environment = environment;
		this.urlBase = 'http://' + grunt.config('helperpress.environments.' + environment + '.home_url') + '/';
		this._apiKey = false;
		this.ignoreConfigKey = false;
	};

	HpWpPlugin.prototype._doRequest = function(action, arg){
		var req, resp,
			endPoint = this.urlBase + '?helperpress_api_key=' + this._getApiKey();

		endPoint += '&helperpress_action=' + action;
		
		if(typeof arg !== 'undefined')
			endPoint += '&helperpress_arg=' + arg;


		grunt.log.debug('Connecting to ' + endPoint);

		req = httpsync.get(endPoint);
		resp = req.end();

		switch(resp.statusCode){

			// success
			case 200:
				return resp.data;

			// incorrect key
			case 401:
				grunt.log.debug('Incorrect key. Removing saved key and fetching again.');
				this._apiKey = false;
				this.ignoreConfigKey = true;
				return this._doRequest(action, arg);

			default:
				grunt.fatal(resp.statusCode + ' Error. HelperPress WP Plugin is probably either not activated or not installed.');
				break;

		}
	};

	HpWpPlugin.prototype._getApiKey = function(){
		
		if(this._apiKey !== false)
			return this._apiKey;

		var configKey = grunt.config('helperpress.environments.' + this.environment + '.hp_wp_api_key');

		console.log(configKey);

		// check config if we're not ignoring it
		if(!this.ignoreConfigKey && typeof configKey === 'string' && configKey !== 'undefined'){
			return configKey;
		}

		curGruntTasks = grunt.cli.tasks;
		grunt.task.clearQueue();
		grunt.task.run('get_hp_wp_plugin_api_key:' + this.environment);
		grunt.task.run(curGruntTasks);

	};

	HpWpPlugin.prototype.getDbDump = function(){
		return this._doRequest('dump_db');
	};

	HpWpPlugin.prototype.importDb = function(remoteFilename){
		// assumes file has been uploaded already
		return this._doRequest('import_db', remoteFilename);
	};

	return HpWpPlugin;

};