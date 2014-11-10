var fs = require('fs'),
	through = require('through');

module.exports = function(grunt){

	var jsCwd = '<%= helperpress.assets_dir %>/_src/js',
		srcFiles = '**/*.js';

	function getFilename(fullpath){
		return fullpath.replace(/^.*[\\\/]/, '');
	}

	// this transform adds require calls into the _main.js module for all files we're
	// browserifying-ifying
	function requireDynamicFiles(file){

		var data = '',
			filename = getFilename(file);

	    return through(write, end);

	    function write (buf) { data += buf }
	    function end () {

			if(filename === '_main.js'){

				var codeToInsert = 'return;',
					allModules = grunt.file.expand(
						{
							cwd: grunt.config.process(jsCwd)
						}, 
						[
							srcFiles,
							'!_main.js',
							'!_config.js'
						]
					);


				for(var toRequire in allModules){
					codeToInsert += 'require("./' + allModules[toRequire].replace(/\.[^/.]+$/, '') + '");';
				}

				data += codeToInsert;

			}

	        this.queue(data);
	        this.queue(null);

	    }
	}


	return {
		options: {
			transform: [
				'browserify-shim',
				'deamdify',
				requireDynamicFiles
			]
		},

		dev: {
			files: {
				'<%= helperpress.assets_dir %>/js/main.js': jsCwd + '/' + srcFiles
			}
		},

		precompiled: {
			files: {
				'<%= helperpress.assets_dir %>/_precompiled/browserify/main.js': jsCwd + '/' + srcFiles
			}
		}
		
	};
}