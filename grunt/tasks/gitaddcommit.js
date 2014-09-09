/*
 * grunt-gitaddcommit
 * 
 *
 * Copyright (c) 2014 40Digits Interactive, LLC
 * Licensed under the MIT license.
 */

'use strict';

var execSync = require('execSync');


module.exports = function(grunt) {

	grunt.registerMultiTask('gitaddcommit', 'Manage git subtrees', function() {

		var options = this.options({
				flags: '--all',
				gitFlags: '',
				message: this.target,
				noVerify: false
			}),
			verifyFlag = options.noVerify ? ' --no-verify' : '',
			gitCmd = 'git ' + options.gitFlags + ' ';



		execSync.run(gitCmd + 'add ' + options.flags);
		execSync.run(gitCmd + 'commit -m "' + options.message.replace(/"/g, "") + '"' + verifyFlag);

	});

};