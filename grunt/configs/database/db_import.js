// this is currently only used in teh pull_db task and is configured there

module.exports = {
	local: {
		options: {
			database: '<%= pkg.config.environments.local.db.database %>',
			user: '<%= pkg.config.environments.local.db.user %>',
			pass: '<%= pkg.config.environments.local.db.pass %>',
			host: '<%= pkg.config.environments.local.db.host %>'
		}
	}
}