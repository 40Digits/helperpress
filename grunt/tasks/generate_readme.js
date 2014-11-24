'use strict';

module.exports = function(grunt) {

	grunt.registerTask('generate_readme', 'Renames HP Readme and generates a new Readme', function(){

		var fs = require('fs'),
			readme = 'README.md',
			hpReadme = 'README-HelperPress.md',
			newReadmeContents = '';
		
		// rename current
		fs.renameSync(readme, hpReadme);

		// generate new README
		newReadmeContents += '# ' + grunt.config('helperpress.wp.theme.name') + '\n\n';
		newReadmeContents += grunt.config('helperpress.wp.theme.desc') + '\n\n';
		newReadmeContents += '*A HelperPress project. See ' + hpReadme + ' for more information.*';

		fs.writeFileSync(readme, newReadmeContents);

	});

};