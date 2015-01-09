module.exports = function(grunt){
    return {
        build_dist_assets: {
            command: function(){
            	var cmd = grunt.config('helperpress.build_cmd');

            	if(!cmd)
            		return 'echo "No build command specified"';
            	else
            		return cmd;
            },
            options: {
                stderr: false,
                execOptions: {
                    cwd: grunt.option('projectdir') + '<%= helperpress.build_cmd_dir %>'
                }
            }
        }
    };
};