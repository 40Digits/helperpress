module.exports = {
	dev: {
		options: {
			style: 'expanded',
			lineNumbers: true,
			sourcemap: false, // TODO: add SASS source maps
			compass: false
		},
		files: [{
			expand: true,
			cwd: '<%= pkg.config.assets_dir %>/_src/sass/',
			src: ['**/*.{scss,sass}'],
			dest: '<%= pkg.config.assets_dir %>/_precompiled/sass',
			ext: '.css'
		}]
	},
	dist: {
		options: {
			style: 'compressed',
			compass: false
		},
		files: [{
			expand: true,
			cwd: '<%= pkg.config.assets_dir %>/_src/sass/',
			src: ['**/*.{scss,sass}'],
			dest: '<%= pkg.config.assets_dir %>/_precompiled/sass',
			ext: '.css'
		}]
	}
};