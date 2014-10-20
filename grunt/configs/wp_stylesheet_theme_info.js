module.exports = function(grunt){
	var fs = require('fs'),

		assetsDir = grunt.package.config.assets_dir,
		sassExt = fs.existsSync(assetsDir + '/_src/sass/style.sass') ? 'sass' : 'scss';

	return {
		options: {
			filename: assetsDir + '/_src/sass/style.' + sassExt
		}
	};
}