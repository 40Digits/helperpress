module.exports = {
	sass: {
		files: '<%= pkg.config.sass_dir %>/*.{scss,sass}',
		tasks: ['sass:dev'],
		options: {
			livereload: true
		}
	}
};