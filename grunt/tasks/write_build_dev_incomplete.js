
module.exports = function(grunt) {

	grunt.registerTask('write_build_dev_incomplete', 'Flags build_dev as incomplete', function(val){

		grunt.config('write_helperpress_config.build_dev_incomplete', {
			options: {
				type: 'local',
				settings: {
					_build_dev_incomplete: val
				}
			}
		});
		grunt.task.run('write_helperpress_config:build_dev_incomplete');

	});

}