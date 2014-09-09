module.exports = {
	theme: {
		src: './wp-theme',
		dest: '<%= helperpress.build_dir %>/wp-content/themes/<%= helperpress.wp.theme.slug %>'
	},
	wpe_gitignore: {
		src: './grunt/templates/wpe-gitignore',
		dest: '<%= helperpress.build_dir %>/.gitignore'
	}
}