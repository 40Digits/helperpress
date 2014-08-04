module.exports = {
	options: {
		overwrite: false
	},
	theme: {
		src: 'wp-theme',
		dest: 'www/wp-content/themes/<%= pkg.config.wp.theme.slug %>'
	},
	sites: {
		src: 'www',
		dest: '<%= pkg.config.apache.sites_dir %>/<%= pkg.config.wp.theme.slug %>'
	}
};