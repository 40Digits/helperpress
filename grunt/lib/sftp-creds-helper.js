var _ = require('lodash'),
	_deepExtend = require('underscore-deep-extend');
	
// initialize _deepExtend into _ object
_.mixin({deepExtend: _deepExtend(_)});

module.exports = function(grunt){

	function buildCreds(environment, existingOpts){

		var sshInfo = grunt.config('helperpress.environments.' + environment + '.ssh'),
			sftpOpts = {};

		if(typeof sshInfo.host === 'undefined'){
			// we need a host defined at minimum
			grunt.fatal('No SSH host defined for "' + environment + '"');
		}else{
			sftpOpts.host = sshInfo.host;
		}

		// map HP's SSH settings to ssh task's
		if(typeof sshInfo.user !== 'undefined'){
			sftpOpts.username = sshInfo.user;
		}
		if(typeof sshInfo.pass !== 'undefined'){
			sftpOpts.password = sshInfo.pass;
		}
		if(typeof sshInfo.keyfile !== 'undefined'){
			sftpOpts.privateKey = grunt.file.read(sshInfo.keyfile);
		}
		if(typeof sshInfo.passphrase !== 'undefined'){
			sftpOpts.passphrase = sshInfo.passphrase;
		}
		if(typeof sshInfo.port !== 'undefined'){
			sftpOpts.port = sshInfo.port;
		}

		if(typeof existingOpts !== 'undefined'){
			sftpOpts = _.deepExtend(sftpOpts, existingOpts);
		}

		return sftpOpts;
		
	}

	return buildCreds;

}