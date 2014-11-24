var wpRndPass = require('randomstring').generate(10); // in case we're installing it fresh

module.exports = {
	options: {
		cmdPath: './vendor/bin/wp',
		wpPath: '<%= helperpress.build_dir %>'
	},

	download_core: {
		version: '<%= helperpress.wp.version %>'
	},

	core_config: {
		dbname: '<%= helperpress.environments.local.db.database %>',
		dbuser: '<%= helperpress.environments.local.db.user %>',
		dbpass: '<%= helperpress.environments.local.db.pass %>',
		dbhost: '<%= helperpress.environments.local.db.host %>'
	},

	db_create: true,

	install_core: {
		url: '<%= helperpress.environments.local.home_url %>',
		title: '<%= helperpress.wp.theme.name %>',
		admin_user: 'j3k',
		admin_password: wpRndPass,
		admin_email: 'j3k.porkins@gmail.com'
	},

	update_core: true,

	rewrite_flush: true,

	install_plugins: '<%= helperpress.wp.plugins %>',

	remove_plugins: ['hello'],

	update_all_plugins: true

};