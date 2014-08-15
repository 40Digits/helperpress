// this is currently only used in teh pull_db task and is configured there

module.exports = {
	local: {
		options: {
			database: '<%= helperpress.environments.local.db.database %>',
			user: '<%= helperpress.environments.local.db.user %>',
			pass: '<%= helperpress.environments.local.db.pass %>',
			host: '<%= helperpress.environments.local.db.host %>'
		}
	}
}