module.exports = {
	sass_dev: {
		files: '<%= pkg.config.assets_dir %>/_src/**/*.{scss,sass,css}',
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

	js: {
		files: '<%= pkg.config.assets_dir %>/_src/**/*.js',
		tasks: ['concat:js'],
		options: {
			livereload: true
		}
	}
};