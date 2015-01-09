module.exports = function(grunt){
	return {
		options: {
			force: true // for the love of god, don't delete /
		},

		// packages and assets
		built: [

			// composer
			'vendor',

			// wp dir
			grunt.option('projectdir') + '/<%= helperpress.build_dir %>'
		],

		// wp dir
		build_dir: [
			grunt.option('projectdir') + '/<%= helperpress.build_dir %>'
		],

		// clean every WP default theme for the next 10000 years
		wp_default_themes: [
			grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/themes/twenty*'
		],

		// WP stuff
		wp: [
			grunt.option('projectdir') + '/<%= helperpress.build_dir %>',
			grunt.option('projectdir') + 'db',
			grunt.option('projectdir') + 'uploads'
		],

		// reset local config
		reset: [
			grunt.option('projectdir') + 'helperpress.local.json'
		],

		// clean the non-distrubutable stuff in the build dir. BE CAREFUL HERE
		non_dist: [
			grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>/assets/_src',
			grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>/assets/_precompiled'
		]
	};
};