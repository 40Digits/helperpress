var execSync = require('execSync'),
	_ = require('lodash');

'use strict';

module.exports = function(grunt) {

	var distDir = 'www-dist';

	grunt.registerTask('deploy', 'Deploy to WPEngine using Git Deploy', function(environment) {

		if(typeof environment === 'undefined'){
			// infer based on current gir branch

			var curBranch = execSync.exec('git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3').stdout.trim(), // via http://stackoverflow.com/questions/1593051/how-to-programmatically-determine-the-current-checked-out-git-branch#comment-9751841
				envConfig = grunt.config('helperpress.environments');

			if( _.indexOf(Object.keys(envConfig), curBranch) === -1 ){
				grunt.fatal('Looks like there is no environment configured for git branch "' + curBranch + '"');
			}

			environment = curBranch;
		}

		this.requiresConfig(
			'helperpress.environments.' + environment + '.deploy_method'
		);

		// set correct output dir
		grunt.config('helperpress.build_dir', distDir);

		// clean previous build
		grunt.task.run('clean:build_dir');

		// build distributable code
		grunt.task.run('build_dist');

		// run the appropriate deploy method
		switch( grunt.config('helperpress.environments.' + environment + '.deploy_method') ){

			case 'wpe':
				grunt.task.run('_deploy_wpe_git:' + environment);
				break;

			case 'rsync':
			case 'none':
				break;

		}

	});

	grunt.registerTask('_deploy_wpe_git', 'Internal helper function for deploy_wpe', function(environment) {

		this.requiresConfig(
			'helperpress.environments.' + environment + '.remote'
		);

		var gitFlag = '--git-dir="' + distDir + '/.git" --work-tree="' + distDir + '"',
			gitCmd = 'git ' + gitFlag + ' ';

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
		execSync.run(gitCmd + 'push wpe ' + environment + ':master');

	});

}