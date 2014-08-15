module.exports = {
	options: {
		separator: ';'
	},

	browserify: {
		src: '<%= helperpress.assets_dir %>/_precompiled/browserify/**/*.js',
		dest: '<%= helperpress.assets_dir %>/js/main.js'
	},

	browserify_dist: {
		src: '<%= helperpress.assets_dir %>/_precompiled/browserify/**/*.js',
		dest: '<%= helperpress.assets_dir %>/_precompiled/concat/main.js'
	}
}