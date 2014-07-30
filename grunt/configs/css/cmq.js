// Combine Media Queries
module.exports = {
	your_target: {
		files: {
			'<%= pkg.config.sass_dir %>/*.{scss,sass}': ['<%= pkg.config.assets_dir %>/_src/css/prefix/*.css']
		}
	}
};