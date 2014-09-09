var execSync = require('execSync');

'use strict';

module.exports = function(grunt) {


	grunt.registerTask('deploy_wpe', 'Manage git subtrees', function(environment) {
		
		var distDir = 'www-dist-wpe',
			gitFlag = '--git-dir="' + distDir + '"',
			gitCmd = 'git ' + gitFlag + ' ';

		grunt.requiresConfig([
			'helperpress.environments.' + environment + '.remote'
		]);

		// set correct output dir
		grunt.config('helperpress.build_dir', distDir);

		// build distributable code
		//grunt.task.run('build_dist');

		// copy WPE .gitignore
		grunt.task.run('copy:wpe_gitignore');

		// git init
		execSync.run(gitCmd + 'init');

		// add wpe remote
		execSync.run(gitCmd + 'remote add wpe ' + grunt.config('helperpress.environments.' + environment + '.remote'));

		// git addcommit
		grunt.config('gitaddcommit.wpe_deploy', {
			options: {
				gitFlags: gitFlag,
				message: 'HelperPress Deploy'
			}
		});
		grunt.task.run('gitaddcommit:wpe_deploy');

		// git push current branch as master
		//execSync(gitCmd + 'push wpe ' + environment + ':master');

	});

}