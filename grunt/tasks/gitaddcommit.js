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
				message: this.target,
				noVerify: false
			}),
			verifyFlag = options.noVerify ? ' --no-verify' : '';



		execSync.run('git add ' + options.flags);
		execSync.run('git commit -m "' + options.message.replace(/"/g, "") + '"' + verifyFlag);

	});

};