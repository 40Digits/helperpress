module.exports = {
	options:{
		atBegin: true
	},
	
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
			livereload: true
		}
	},

	imagemin: {
		files: [
			// all images in the assets dir
			'<%= helperpress.assets_dir %>/_src/**/*.{png,gif,jpg,jpeg}'
		],
		tasks: ['newer:imagemin:assets_dev'],
		options: {
			livereload: true
		}
	},

	files_reload: {
		files: [
			// everything in the theme dir except the assets dir (because we're already watching that)
			'./wp-theme/!(assets)',
			// the assets dir and subfolders except 'js' and 'images' (because we're already watching them)
			'<%= helperpress.assets_dir %>/!(js|images)/**'
		],
		options: {
			livereload: true
		}
	},

	browserify: {
		files: [
			// all js files in the assets dir
			'<%= helperpress.assets_dir %>/_src/**/*.js'
		],
		tasks: [
			'browserifyBower:libs:nowrite',
			'browserify:app'
		],
		options: {
			livereload: true
		}
	},

	browserifyBower: {
		files: ['bower.json'],
		tasks: [
			'browserifyBower',
			'concat:browserify'
		],
		options: {
			livereload: true
		}
	}
};