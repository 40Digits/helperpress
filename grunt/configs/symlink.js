module.exports = {
	options: {
		overwrite: false
	},
	theme: {
		src: './wp-theme',
		dest: './www/wp-content/themes/<%= helperpress.wp.theme.slug %>'
	},
	uploads: {
		src: './uploads',
		dest: './www/wp-content/uploads'
	},
	sites: {
		src: './www',
		dest: '<%= helperpress.apache.sites_dir %>/<%= helperpress.wp.theme.slug %>'
	}
};