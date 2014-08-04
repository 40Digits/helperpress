
'use strict';

var execSync = require('execSync'),
	ejs = require('ejs');

module.exports = function(grunt) {

	grunt.registerMultiTask('apache_config', 'Setup and configure site in Apache', function() {

		var options = this.options(),
			hostName = options.url_scheme.replace('*', options.site_slug);

		if(options.apache_scheme === 'vhost'){

			// vhost setting
			var vhostTemplate = grunt.file.read('templates/vhost.ejs'),
				newVhostFile = options.vhost_dir + '/' + options.site_slug + '.conf',
				vhostData = {
					slug: options.site_slug,
					hostName: hostName,
					docRoot: options.doc_root,
					logsDir: options.logs_dir
				},
				vhostContents = ejs.render(vhostTemplate, vhostData);

			// create the vhost file
			grunt.file.write(newFile, vhostContents);


			// Setup local hosts file
			var lhConfig = {
				setSiteLh: {
					options: {
						rules: [{
							ip: '127.0.0.1',
							hostname: hostName,
							type: 'set'
						}]
					}
				}
			}
			grunt.task.run('localhosts:setSiteLh');

			// a2ensite if necessary
			if(options.a2ensite){
				execSync.run('a2ensite ' + options.site_slug);
			}

			// restart apache
			if(options.as_service){
				execSync.run('service apache2 reload');
			} else {
				execSync.run('apachectl -e debug -k restart');
			}

		} else if(options.apache_scheme === 'subdir') {

			grunt.task.run('symlink:sites');

		}

	});

};
