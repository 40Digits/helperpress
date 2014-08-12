module.exports = {
	js_concat: {
		files: {
			'<%= pkg.config.assets_dir %>/js/main.js': ['<%= pkg.config.assets_dir %>/_precompiled/concat/main.js']
		}
	}
};