var wpRndPass = require('randomstring').generate(10); // in case we're installing it fresh

module.exports = {
	options: {
		cmdPath: './vendor/bin/wp',
		wpPath: './www'
	},

	download_core: true,

	core_config: {
		dbname: '<%= pkg.config.environments.local.db.database %>',
		dbuser: '<%= pkg.config.environments.local.db.user %>',
		dbpass: '<%= pkg.config.environments.local.db.pass %>',
		dbhost: '<%= pkg.config.environments.local.db.host %>'
	},

	db_create: true,

	install_core: {
		url: '<%= pkg.config.environments.local.url %>',
		title: '<%= pkg.config.environments.wp.theme.name %>',
		admin_user: '40digits',
		admin_password: wpRndPass,
		admin_email: 'j3k.porkins@gmail.com'
	},

	install_plugins: '<%= pkg.config.wp.plugins %>',

	remove_plugins: ['hello']

};