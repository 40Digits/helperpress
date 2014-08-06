module.exports = {
	options: {
		globalFlags: {
			host: '<%= pkg.config.environments.local.db.host %>',
			name: '<%= pkg.config.environments.local.db.database %>',
			user: '<%= pkg.config.environments.local.db.user %>',
			pass: '<%= pkg.config.environments.local.db.pass %>',
			
			verbose: false
		},
	}
}