var execSync = require('execSync'),
	wpCliPath = './composer_vendor/wp-cli/wp-cli/bin/wp'; // TODO: this should be configured elsewhere

// Core

function coreDownload(path){
	var cmd = wpCliPath + ' core download';

	if(typeof path === 'undefined')
		cmd += ' --path=' + path;

	execSync.run(cmd);
}

// Plugins

function pluginInstall(plugin, activate){
	var cmd = wpCliPath + ' plugin install';

	if(typeof plugin === 'undefined')
		return console.log('No plugin specified.');

	cmd += ' ' + plugin;

	if(activate)
		cmd += ' --activate';

	execSync.run(cmd);

}

function pluginActivate(plugin){
	var cmd = wpCliPath + ' plugin activate';

	if(typeof plugin === 'undefined')
		return console.log('No plugin specified.');

	cmd += ' ' + plugin;

	if(activate)
		cmd += ' --activate';

	execSync.run(cmd);

}

function pluginBatchInstall(plugins){
	plugins.forEach(function(el){
		pluginInstall(el);
	});
}

function pluginBatchActivate(plugins){
	plugins.forEach(function(el){
		pluginActivate(el);
	});
}

module.exports = {
	coreDownload: coreDownload,
	pluginBatchInstall: pluginBatchInstall,
	pluginBatchActivate: pluginBatchActivate
}