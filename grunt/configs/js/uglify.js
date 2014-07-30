module.exports = {
	my_target: {
		files: {
			'<%= pkg.config.assets_dir %>/js/main.min.js': ['<%= pkg.config.assets_dir %>/js/main.js']
		}
	}
};