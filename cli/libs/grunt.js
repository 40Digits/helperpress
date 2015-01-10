// Interface for HelperPress's Grunt
// Pretty much replaces the need for grunt-cli


module.exports = function(task, options, path){

	var hpPath = __dirname + '/../..',
		gruntPath = hpPath + '/node_modules/grunt/lib/grunt.js';

	// add some options we'll always need
	options.gruntfile = hpPath + '/Gruntfile.js';
	options.projectdir = path;
	options.no_dev_deps = true;

	// load Grunt
	require(gruntPath).tasks(task, options);
};