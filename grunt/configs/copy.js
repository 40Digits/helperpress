module.exports = function(grunt){
	return {
		theme: {
			files: [

				// rename the theme folder
				{
					src: grunt.option('projectdir') + '<%= helperpress.theme_path %>',
					dest: grunt.option('projectdir') + '<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>'
				},

				// copy dem files
				{
					cwd: grunt.option('projectdir') + '<%= helperpress.theme_path %>/',
					expand: true,
					src: '**',
					dest: grunt.option('projectdir') + '<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>/'
				}
			]
		},
		wpe_gitignore: {
			src: './grunt/templates/wpe-gitignore',
			dest: grunt.option('projectdir') + '<%= helperpress.build_dir %>/.gitignore'
		},
		custom_plugins: {
			files: [{
				expand: true,
				overwrite: true,
				cwd: grunt.option('projectdir') + 'custom_plugins',
				src: '**',
				dest: grunt.option('projectdir') + '<%= helperpress.build_dir %>/wp-content/plugins'
			}]
		},
		hp_plugins: {
			files: [{
				expand: true,
				overwrite: true,
				cwd: './custom_plugins',
				src: '**',
				dest: grunt.option('projectdir') + '<%= helperpress.build_dir %>/wp-content/plugins'
			}]
		}
	};
};