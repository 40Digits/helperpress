module.exports = {
	browserify: {
		files: {
			'<%= helperpress.assets_dir %>/js/main.js': ['<%= helperpress.assets_dir %>/_precompiled/browserify/main.js']
		}
	}
};