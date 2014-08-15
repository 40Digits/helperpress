// Combine Media Queries
module.exports = {
	sass: {
		files: {
			'<%= helperpress.assets_dir %>/_precompiled/cmq': ['<%= helperpress.assets_dir %>/_precompiled/sass/*.css']
		}
	}
};