module.exports = {
	dev: {
		options: {
			style: 'expanded',
			lineNumbers: true,
			sourcemap: false, // TODO: add SASS source maps
			compass: false,
			require: ['sass-globbing']
		},
		files: [{
			expand: true,
			cwd: '<%= helperpress.assets_dir %>/_src/sass/',
			src: ['**/*.{scss,sass}'],
			dest: '<%= helperpress.assets_dir %>/_precompiled/sass',
			ext: '.css'
		}]
	},
	dist: {
		options: {
			style: 'compressed',
			compass: false,
			require: ['sass-globbing']
		},
		files: [{
			expand: true,
			cwd: '<%= helperpress.assets_dir %>/_src/sass/',
			src: ['**/*.{scss,sass}'],
			dest: '<%= helperpress.assets_dir %>/_precompiled/sass',
			ext: '.css'
		}]
	}
};