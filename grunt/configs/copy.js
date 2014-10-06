module.exports = {
	theme: {
		files: [

			// rename the theme folder
			{
				src: 'wp-theme',
				dest: '<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>'
			},

			// copy dem files
			{
				cwd: 'wp-theme/',
				expand: true,
				src: '**',
				dest: '<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>/'
			}
		]
	},
	wpe_gitignore: {
		src: './grunt/templates/wpe-gitignore',
		dest: '<%= helperpress.build_dir %>/.gitignore'
	},
	custom_plugins: {
		files: [{
			expand: true,
			overwrite: true,
			cwd: './custom_plugins',
			src: '*',
			dest: '<%= helperpress.build_dir %>/wp-content/plugins',
			filter: 'isDirectory'
		}]
	}
}