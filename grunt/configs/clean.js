module.exports = {
	built: [
		// bower
		'bower_components',
		'lib',

		// composer
		'vendor',

		// assets
		'<%= helperpress.assets_dir %>/_precompiled',
		'<%= helperpress.assets_dir %>/images',
		'<%= helperpress.assets_dir %>/js',

		// sass subtree
		'<%= helperpress.assets_dir %>/_src/sass',

		// wp dir
		'<%= helperpress.build_dir %>'
	],
	assets: [
		'<%= helperpress.assets_dir %>/_precompiled',
		'<%= helperpress.assets_dir %>/images',
		'<%= helperpress.assets_dir %>/js'
	],
	wp: [
		'<%= helperpress.build_dir %>',
		'db',
		'uploads'
	],
	reset: [
		'site_config.local.json'
	]
};