var fs = require('fs'),
	sassExt = fs.existsSync('./wp-theme/assets/_src/sass/style.sass') ? 'sass' : 'scss';

module.exports = {
	options: {
		sass: './wp-theme/assets/_src/sass/style.' + sassExt
	}
};