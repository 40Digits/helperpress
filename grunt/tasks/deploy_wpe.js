var execSync = require('execSync');

'use strict';

module.exports = function(grunt) {

	var distDir = 'www-dist-wpe',
		gitFlag = '--git-dir="' + distDir + '/.git" --work-tree="' + distDir + '"',
		gitCmd = 'git ' + gitFlag + ' ';

	grunt.registerTask('deploy_wpe', 'Deploy to WPEngine using Git Deploy', function(environment) {

		this.requiresConfig(
			'helperpress.environments.' + environment + '.remote'
		);

		// set correct output dir
		grunt.config('helperpress.build_dir', distDir);

		// build distributable code
		grunt.task.run('build_dist');

		// do the git deploy schtuff
		grunt.task.run('_deploy_wpe_git:' + environment);

	});

	grunt.registerTask('_deploy_wpe_git', 'Internal helper function for deploy_wpe', function(environment) {

		// copy WPE .gitignore
		execSync.run('cp grunt/templates/wpe-gitignore ' + distDir + '/.gitignore');

		// git init
		execSync.run(gitCmd + 'init');

		// add wpe remote
		execSync.run(gitCmd + 'remote add wpe ' + grunt.config('helperpress.environments.' + environment + '.remote'));

		// git add & commit
		execSync.run(gitCmd + 'add --all');
		execSync.run(gitCmd + 'commit -m "HelperPress Deploy" --no-verify');

		// git push current branch as master
		execSync(gitCmd + 'push wpe ' + environment + ':master');

	});

}