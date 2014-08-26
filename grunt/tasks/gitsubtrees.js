/*
 * grunt-gitsubtrees
 * 
 *
 * Copyright (c) 2014 40Digits Interactive, LLC
 * Licensed under the MIT license.
 */

'use strict';

var execSync = require('execSync');


function addRemote(id, url) {
	execSync.run('git remote add -f ' + id + ' ' + url);
}

function addSubtree(id, path, branch) {
	execSync.run('git subtree add --prefix ' + path + ' ' + id + ' ' + branch + ' --squash');
}

module.exports = function(grunt) {

	grunt.registerMultiTask('gitsubtrees', 'Manage git subtrees', function() {
		// Merge task-specific and/or target-specific options with these defaults.

		// make sure there are no uncomitted changes
		var gitStatus = execSync.exec('git status -s');
		
		if(gitStatus.stdout.length > 0){
			grunt.fatal('Cannot pull subtree(s), there are uncomitted changes to this repo. Please commit, remove, or stash changes to continue.');
		}

		addRemote(this.target, this.data.url);
		addSubtree(this.target, this.data.path, this.data.branch);

	});

};