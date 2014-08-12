module.exports = {
	options: {
		separator: ';'
	},

	js: {
		src: '<%= pkg.config.assets_dir %>/_src/js/**/*.js',
		dest: '<%= pkg.config.assets_dir %>/js/main.js'
	},

	js_dist: {
		src: '<%= pkg.config.assets_dir %>/_src/js/**/*.js',
		dest: '<%= pkg.config.assets_dir %>/_precompiled/concat/main.js'
	}
}