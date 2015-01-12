module.exports = function(grunt){
	return {
		options: {
			filename: grunt.option('projectdir') + '/.gitignore'
		}
	};
}