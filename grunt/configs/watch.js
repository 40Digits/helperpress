module.exports = {
	sass_dev: {
		files: '<%= helperpress.assets_dir %>/_src/**/*.{scss,sass,css}',
		tasks: [
			'sass:dev',
			'autoprefixer:sass'
			],
		options: {
			livereload: true
		}
	},

	files_reload: {
		files: [
			'./wp-theme/**/*.{jpg,gif,jpeg,php}'
		],
		options: {
			livereload: true
		}
	},

	browserify: {
		files: '<%= helperpress.assets_dir %>/_src/**/*.js',
		tasks: [
			'browserifyBower:libs:nowrite',
			'browserify:app'
		],
		options: {
			livereload: true
		}
	},

	browserifyBower: {
		files: './bower.json',
		tasks: [
			'browserifyBower',
			'concat:browserify'
		],
		options: {
			livereload: true
		}
	}
};