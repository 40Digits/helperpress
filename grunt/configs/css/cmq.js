// Combine Media Queries
module.exports = {
	sass: {
		files: {
			'<%= pkg.config.assets_dir %>/_precompiled/cmq': ['<%= pkg.config.assets_dir %>/_precompiled/sass/*.css']
		}
	}
};