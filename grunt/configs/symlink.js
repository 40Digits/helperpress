module.exports = {
	options: {
		overwrite: false
	},
	theme: {
		src: 'wp-theme',
		dest: 'www/wp-content/themes/<%= pkg.config.wp.theme_slug %>'
	},
	sites: {
		src: 'www',
		dest: '<%= pkg.config.environments.local.wp.wp_path %>'
	}
};