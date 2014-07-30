/*
 * grunt-gitsubtrees
 * 
 *
 * Copyright (c) 2014 40Digits Interactive, LLC
 * Licensed under the MIT license.
 */

'use strict';

var execSync = require('execSync');


function addRemote(id, url){
  execSync.run('git remote add -f ' + id + ' ' + url);
}

function addSubtree(id, path, branch){
  execSync.run('git subtree add --prefix ' + path + ' ' + id + ' ' + branch + ' --squash');
}

module.exports = function(grunt) {

  grunt.registerMultiTask('gitsubtrees', 'Manage git subtrees', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    // TODO: error/response checking

    addRemote(this.target, this.data.url);
    addSubtree(this.target, this.data.path, this.data.branch);

  });

};
