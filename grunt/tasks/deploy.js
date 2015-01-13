'use strict';

var execSync = require('execSync'),
	_ = require('lodash');

module.exports = function(grunt) {

	var distDir = 'www-dist';

	grunt.registerTask('deploy', 'Deploy to WPEngine using Git Deploy', function(environment) {

		var curBranch = execSync.exec('git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3').stdout.trim(); // via http://stackoverflow.com/questions/1593051/how-to-programmatically-determine-the-current-checked-out-git-branch#comment-9751841

		// default to current git branch
		if(typeof environment === 'undefined'){

			var envConfig = grunt.config('helperpress.environments');

			// make sure that the current branch has an associated config
			if( _.indexOf(Object.keys(envConfig), curBranch) === -1 ){
				grunt.fatal('Looks like there is no environment configured for git branch "' + curBranch + '"');
			}

			environment = curBranch;
		}

		// warn if they're trying to deploy to an env that is not the current branch
		if(environment !== curBranch ){
			grunt.hpLog.warn('Deploying current branch "' + curBranch + '" to environment "' + environment + '" is probably not want you wanted to do. If it is, then --force it.');
		}

		this.requiresConfig(
			'helperpress.environments.' + environment + '.deploy_method'
		);

		// set correct output dir
		grunt.config('helperpress.build_dir', distDir);

		// build distributable code
		grunt.task.run('build_dist');

		// run the appropriate deploy method
		switch( grunt.config('helperpress.environments.' + environment + '.deploy_method') ){

			case 'wpe':
				grunt.task.run('_deploy_wpe_git:' + environment);
				break;

			case 'rsync':

				break;
			case 'none':
			default:
				grunt.hpLog.ok('deploy_method for "' + environment + '" is set to "none", so we\'ve built it in "' + distDir + '" and that\'s all.');
				break;

		}

	});

	grunt.registerTask('_deploy_wpe_git', 'Internal helper function for deploy_wpe', function(environment) {

		var wpeDir = './www-wpe';

		this.requiresConfig(
			'helperpress.environments.' + environment + '.remote'
		);

		var gitFlag = '--git-dir="' + wpeDir + '/.git" --work-tree="' + wpeDir + '"',
			gitCmd = 'git ' + gitFlag + ' ';

		// clean & create WPE dir
		execSync.run('rm -rf ' + wpeDir);
		execSync.run('mkdir ' + wpeDir);

		// copy WPE .gitignore
		execSync.run('cp grunt/templates/wpe-gitignore ' + wpeDir + '/.gitignore');

		// git init it
		execSync.run(gitCmd + 'init');

		// add wpe remote
		execSync.run(gitCmd + 'remote add origin ' + grunt.config('helperpress.environments.' + environment + '.remote'));

		// git pull
		execSync.run(gitCmd + 'fetch origin master');
		execSync.run(gitCmd + 'reset --hard origin/master');

		// copy and overwrite, then finish up
		execSync.run('cp -rf ' + distDir + '/* ' + wpeDir);

		// git add & commit
		execSync.run(gitCmd + 'add --all');
		execSync.run(gitCmd + 'commit -m "HelperPress Deploy" --no-verify');

		// git push
		execSync.run(gitCmd + 'push origin master');



	});

}