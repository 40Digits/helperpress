module.exports = {
	sass_dev: {
		files: [
			// all sass and css files in the assets dir
			'<%= helperpress.assets_dir %>/_src/**/*.{scss,sass,css}'
		],
		tasks: [
			'sass:dev',
			'autoprefixer:sass'
		],
		options: {
			livereload: true,
			atBegin: true
		}
	},

	imagemin: {
		files: [
			// all images in the assets dir
			'<%= helperpress.assets_dir %>/_src/**/*.{png,gif,jpg,jpeg}'
		],
		tasks: ['newer:imagemin:assets_dev'],
		options: {
			livereload: true,
			atBegin: true
		}
	},

	files_reload: {
		files: [
			// everything in the theme dir except the assets dir (because we're already watching that)
			'./wp-theme/!(assets)',
			// the assets dir and subfolders except 'js' and 'images' (because we're already watching them)
			'<%= helperpress.assets_dir %>/!(js|images|(_*))/**'
		],
		options: {
			livereload: true
		}
	},

	browserify: {
		files: [
			// all js files in the js assets dir
			'<%= helperpress.assets_dir %>/_src/js/**/*.js'
		],
		tasks: [
			'browserifyBower:libs:nowrite',
			'browserify:app'
		],
		options: {
			livereload: true,
			atBegin: false // the browserifyBower target will catch it atBegin.
		}
	},

	browserifyBower: {
		files: ['bower.json'],
		tasks: [
			'browserifyBower',
			'browserify:app',
		],
		options: {
			livereload: true,
			atBegin: true
		}
	}
};		