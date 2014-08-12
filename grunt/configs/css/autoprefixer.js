module.exports = {
	options: {
		browsers: ['last 2 version', 'ie 9']
	},
	cmq: {
		expand: true,
		flatten: true,
		cwd: '<%= pkg.config.assets_dir %>/_precompiled/cmq/',
		src: '*.css',
		dest: '<%= pkg.config.css_dir %>'
	},
	sass: {
		expand: true,
		flatten: true,
		cwd: '<%= pkg.config.assets_dir %>/_precompiled/sass/',
		src: '*.css',
		dest: '<%= pkg.config.css_dir %>'
	}
};