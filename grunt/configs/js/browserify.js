module.exports = {
	options: {
		transform: [
			'browserify-shim',
			'deAMDify'
		]
	},

	app: {
		files: {
			'<%= helperpress.assets_dir %>/_precompiled/browserify/main.js': [
				'<%= helperpress.assets_dir %>/_src/**/*.js'
			]
		}
	}
};