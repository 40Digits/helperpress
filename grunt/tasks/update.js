module.exports = function(grunt){

	grunt.registerTask('update', ['prompt:update', 'do_update'] );

	grunt.registerTask('do_update', 'Apply selected Updates', function(){
		grunt.task.run( grunt.config('do_update') );
	});

}