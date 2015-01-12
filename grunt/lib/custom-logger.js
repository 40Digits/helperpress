'use strict';

module.exports = function(grunt){

	// if we're verbose or debuggin, treat hpLog as an alias
	if(grunt.option('verbose') || grunt.option('debug') || !grunt.option('no_dev_deps')){
		grunt.hpLog = grunt.log;
		return grunt;
	}

	// quiet, you!
	grunt.log.muted = true;

	// use our own logging system
	var loggers = [ 'error', 'errorLns', 'fatal', 'warn', 'ok', 'oklns', 'subhead', 'write', 'writeln', 'writeFlags' ];

	grunt.hpLog = {};
	loggers.forEach(function(logger){
		grunt.hpLog[logger] = function(msg){
			grunt.log.muted = false;
			grunt.log[logger](msg);
			grunt.log.muted = true;
		};
	});

	return grunt;
};