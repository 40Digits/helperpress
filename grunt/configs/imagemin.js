var jpegRecompress = require('imagemin-jpeg-recompress');

module.exports = {
	options: {
		use: [jpegRecompress()]
	},
	assets_dev: {
		files: [{
			expand: true,
			cwd: '<%= helperpress.assets_dir %>/_src/images',
			src: ['**/*.{png,jpg,gif,jpeg}'],
			dest: '<%= helperpress.assets_dir %>/images'
		}]
	},
	assets_dist: {
		options: {
			optimizationLevel: 6
		},
		files: [{
			expand: true,
			cwd: '<%= helperpress.assets_dir %>/_src/images',
			src: ['**/*.{png,jpg,gif,jpeg}'],
			dest: '<%= helperpress.assets_dir %>/images'
		}]
	}
}