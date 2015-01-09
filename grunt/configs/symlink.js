module.exports = function(grunt){
	return {
		options: {
			overwrite: false
		},
		theme: {
			src: './wp-theme',
			dest: grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>'
		},
		sites: {
			src: grunt.option('projectdir') + '<%= helperpress.build_dir %>',
			dest: '<%= helperpress.apache.sites_dir %>/<%= helperpress.wp.theme.slug %>'
		},
		custom_plugins: {
			files: [{
				expand: true,
				overwrite: true,
				cwd: './custom_plugins',
				src: '*',
				dest: grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/plugins',
				filter: 'isDirectory'
			}]
		},
		hp_plugins: {
			files: [{
				expand: true,
				overwrite: true,
				cwd: './custom_plugins',
				src: '*',
				dest: grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/plugins',
				filter: 'isDirectory'
			}]
		}
	};
};