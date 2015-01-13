module.exports = function(grunt){

	grunt.registerTask( 'init', function(){

		grunt.task.run([
			// interactively setup this repo
			'prompt:repo_config',
			'write_helperpress_config:repo_config',

			// add WP theme definition banner to stylesheet
			'wp_stylesheet_theme_info',

			// add gitignore rules
			'hp_gitignore_rules'
		]);

		if(grunt.option('skip-install'))
			return;

		grunt.task.run('install');

	});
	grunt.registerTask( 'init_project', ['init'] );
};