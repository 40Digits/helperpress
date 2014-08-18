module.exports = {
	built: [
		'bower_components',
		'vendor',
		'wp-theme/assets/_precompiled',
		'wp-theme/assets/_src/sass',
		'<%= helperpress.build_dir %>'
	],
	assets: [
		'wp-theme/assets/_precompiled'
	],
	wp: [
		'<%= helperpress.build_dir %>',
		'db',
		'uploads'
	],
	reset: [
		'site_config.json',
		'site_config.local.json'
	]
};