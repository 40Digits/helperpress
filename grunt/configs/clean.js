module.exports = {

	// packages and assets
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

		// wp dir
		'<%= helperpress.build_dir %>'
	],

	// wp dir
	build_dir: [
		'<%= helperpress.build_dir %>'
	],

	// compiled assets
	assets: [
		'<%= helperpress.assets_dir %>/_precompiled',
		'<%= helperpress.assets_dir %>/images',
		'<%= helperpress.assets_dir %>/js',
		'.sass-cache'
	],

	// clean every WP defualt theme for the next 1000 years
	wp_default_themes: [
		'<%= helperpress.build_dir %>/wp-content/themes/twenty*'
	],

	// WP stuff
	wp: [
		'<%= helperpress.build_dir %>',
		'db',
		'uploads'
	],

	// reset local config
	reset: [
		'helperpress.local.json'
	],

	// clean the non-distrubutable stuff in the build dir. BE CAREFUL HERE
	non_dist: [
		'<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>/assets/_src',
		'<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>/assets/_precompiled'
	]
};