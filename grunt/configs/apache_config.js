module.exports = {
	options: {
		site_slug: '<%= pkg.config.wp.theme.slug %>',
		url_scheme: '<%= pkg.config.apache.url_scheme %>',
		apache_scheme: '<%= pkg.config.apache.scheme %>',
		vhost_dir: '<%= pkg.config.apache.vhost_dir %>',
		doc_root: '<%= pkg.config.environments.local.wp.wp_path %>',
		logs_dir: '<%= pkg.config.apache.logs_dir %>',
		as_service: '<%= pkg.config.apache.as_service %>',
		a2ensite: '<%= pkg.config.apache.a2ensite %>'
	}
};