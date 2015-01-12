
'use strict';

var execSync = require('execSync'),
	ejs = require('ejs'),
	
	hostExists = require(__dirname + '/../lib/hosts-util').hostExists,
	sudo = require(__dirname + '/../lib/apply-sudo');

module.exports = function(grunt) {

	grunt.registerMultiTask('apache_config', 'Setup and configure site in Apache', function() {

		var options = this.options(),
			hostName = options.url_scheme.replace('*', options.site_slug);

		this.requires(['prompt:sudo_pass']);

		if(options.apache_scheme === 'vhost'){

			// vhost setting
			var vhostTemplate = grunt.file.read(__dirname + '/../templates/vhost.ejs'),
				newVhostFile = options.vhost_dir + '/' + options.site_slug + '.conf',
				vhostData = {
					slug: options.site_slug,
					hostName: hostName,
					docRoot: options.doc_root,
					logsDir: options.logs_dir
				},
				vhostContents = ejs.render(vhostTemplate, vhostData);

			// create the vhost file
			grunt.hpLog.subhead('Creating virtualhost file...');
			execSync.run( sudo.apply('echo "' + vhostContents.replace('"', '\"') + '" > ' + newVhostFile ) );


			// Point host name to localhost in hosts file
			grunt.hpLog.subhead('Defining "' + hostName + '" in hosts file...');

			if( hostExists(hostName, '127.0.0.1') ){
				grunt.hpLog.ok('Host already defined.');
			}else{

				var lhLine = '\n127.0.0.1	' + hostName;
				execSync.run( sudo.apply('echo "' + lhLine + '" >> /etc/hosts') );

				grunt.hpLog.ok('Host defined.');

			}


			// a2ensite if necessary
			if(options.a2ensite){
				execSync.run( sudo.apply('a2ensite ' + options.site_slug) );
			}

			// restart apache
			grunt.hpLog.subhead('Restarting Apache...');
			if(options.as_service){
				execSync.run( sudo.apply('service apache2 reload') );
			} else {
				execSync.run( sudo.apply('apachectl -k restart') );
			}

		} else if(options.apache_scheme === 'subdir') {

			grunt.task.run('symlink:sites');


		}

	});

};
