// Minify CSS
module.exports = {
	combine: {
		files: [{
			expand: true,
			cwd: '<%= helperpress.assets_dir %>/_precompiled/cssmin/',
			src: ['*.css', '!*.min.css'],
			dest: '<%= helperpress.css_dir %>',
			ext: '.css'
		}]
	}
};
