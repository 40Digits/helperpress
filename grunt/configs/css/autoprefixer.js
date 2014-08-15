module.exports = {
	options: {
		browsers: ['last 2 version', 'ie 9']
	},
	cmq: {
		expand: true,
		flatten: true,
		cwd: '<%= helperpress.assets_dir %>/_precompiled/cmq/',
		src: '*.css',
		dest: '<%= helperpress.css_dir %>'
	},
	sass: {
		expand: true,
		flatten: true,
		cwd: '<%= helperpress.assets_dir %>/_precompiled/sass/',
		src: '*.css',
		dest: '<%= helperpress.css_dir %>'
	}
};