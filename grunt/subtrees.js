var execSync = require('execSync');

function install(subtrees){
	if(typeof subtrees === 'undefined')
		return;

	for( var id in subtrees ){

		// TODO: error/response checking

		addRemote(id, subtrees[id].url);

		addSubtree(id, subtrees[id].path, subtrees[id].branch);
		
	}
}

function addRemote(id, url){
	execSync.run('git remote add -f ' + id + ' ' + url);
}

function addSubtree(id, path, branch){
	execSync.run('git subtree add --prefix ' + path + ' ' + id + ' ' + branch + ' --squash');
}
	

module.exports = {
	install: install
}