var path = require('path');

module.exports = {
	install: {
		options: {
			verbose: true,
			targetDir: './wp-theme/assets/_src/',
			layout: function(type, component, source) {
				
				if(type === '__untyped__'){

					var ext = source.match(/\.[0-9a-z]+$/i)[0].substr(1);
					console.log(ext);

					switch(ext){
						case 'jpg':
						case 'png':
						case 'gif':
						case 'jpeg':
						case 'svg':
							type = 'image';
							break;

						default:
							type = ext;
					}

				}

				return path.join(type, 'vendor', component);
			}
		}
	}	
};