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
			cwd: '<%= pkg.config.sass_dir %>',
			src: ['*.{scss,sass}'],
			dest: '<%= pkg.config.css_dir %>',
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
			cwd: '<%= pkg.config.sass_dir %>',
			src: ['*.{scss,sass}'],
			dest: '<%= pkg.config.css_dir %>/',
			ext: '.css'
		}]
	}
};