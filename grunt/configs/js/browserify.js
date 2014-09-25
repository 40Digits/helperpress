module.exports = {
	options: {
		transform: [
			'browserify-shim',
			'deamdify'
		]
	},

	app: {
		files: [
			{
				cwd: '<%= helperpress.assets_dir %>/_src/js/',
				expand: true,
				src: ['**/*.js','!_config.js'],
				dest: '<%= helperpress.assets_dir %>/_precompiled/browserify'
			}
		]
	}
};