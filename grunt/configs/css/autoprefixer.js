module.exports = {
	options: {
		browsers: ['last 2 version', 'ie 9']
	},
	// prefix all files
	multiple_files: {
		expand: true,
		flatten: true,
		src: '<%= pkg.config.assets_dir %>/_src/css/raw/*.css',
		dest: '<%= pkg.config.assets_dir %>/_src/css/prefix/'
	}
};