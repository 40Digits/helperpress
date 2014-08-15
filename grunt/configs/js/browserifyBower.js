module.exports = {
	libs:{
		options: {
			file: '<%= helperpress.assets_dir %>/_precompiled/browserify/lib.js',
			forceResolve: {
				// define the main js file in a bower package if not defined in bower.json
				// "wysihtml5": "dist/wysihtml5-0.3.0.min.js'"
			}
		}
	}
};