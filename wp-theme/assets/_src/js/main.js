define( ['app/_config'], function(config){

	// config dat mug.
	requirejs.config(config.requirejs);

	require( function(){
		var toRequire = [],
			toIgnore = [];

		function parseFiles(i, file){
			if( file.charAt(0) === '!' )
				toIgnore.push(file);
			else
				toRequire.push(file);
		}

		// run selector filters
		$.each(config.selectors, function(selector, files){
			if( $(selector).length > 0 )
				$.each(files, parseFiles);
		});

		// require the files if not in toIgnore
		for(var i = 0; i < toRequire.length; i++){
			if($.inArray('!' + toRequire[i], toIgnore) === -1)
				require([toRequire[i]]);
		}

	});
});



