module.exports = function(grunt){

	grunt.registerTask( 'init_project', [

		// interactively setup this repo
		'prompt:repo_config',
		'write_helperpress_config:repo_config',

		// add WP theme definition banner to stylesheet
		'wp_stylesheet_theme_info'

	]);
};