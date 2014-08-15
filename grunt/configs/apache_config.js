module.exports = {
	local: {
		options: {
			site_slug: '<%= helperpress.wp.theme.slug %>',
			url_scheme: '<%= helperpress.apache.url_scheme %>',
			apache_scheme: '<%= helperpress.apache.scheme %>',
			vhost_dir: '<%= helperpress.apache.vhost_dir %>',
			doc_root: '<%= helperpress.environments.local.wp_path %>',
			logs_dir: '<%= helperpress.apache.logs_dir %>',
			as_service: '<%= helperpress.apache.as_service %>',
			a2ensite: '<%= helperpress.apache.a2ensite %>'
		}
	}
};