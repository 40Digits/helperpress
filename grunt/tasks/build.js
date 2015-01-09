module.exports = function(grunt){

	grunt.registerTask( 'build', function(type){

		if(typeof type === 'undefined')
			type = "dist";

		if(type == "dist" || type == "dev"){
			grunt.task.run("buid_" + type);
		}else{
			grunt.log.error('"' + type + '" is not a vaild argument for "build". Use "dist" or "dev"');
		}

	});
};