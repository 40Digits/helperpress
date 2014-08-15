module.exports = {
	options: {
		globalFlags: {
			host: '<%= helperpress.environments.local.db.host %>',
			name: '<%= helperpress.environments.local.db.database %>',
			user: '<%= helperpress.environments.local.db.user %>',
			pass: '<%= helperpress.environments.local.db.pass %>',
			
			verbose: false
		},
	}
}