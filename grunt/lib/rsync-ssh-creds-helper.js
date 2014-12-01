module.exports = function(grunt){
	
	var _ = require('lodash'),
		_deepExtend = require('underscore-deep-extend');
		
	// initialize _deepExtend into _ object
	_.mixin({deepExtend: _deepExtend(_)});

	function RsyncCredsHelper(environment){

		if(typeof environment === 'undefined'){
			return grunt.fatal('RsyncCredsHelper requires an environment to be specified');
		}

		this.environment = environment;
		this.sshInfo = grunt.config('helperpress.environments.' + this.environment + '.ssh');

		if(typeof this.sshInfo === 'undefined'){
			grunt.fatal('Remote server access via rsync requires SSH credentials to be defined. None found for "' + this.environment + '" environment.');
		}
		
		// build sshString
		if(typeof this.sshInfo.host !== 'undefined'){
			// we build this dynamically in case they want the SSH user inferred
			this.sshString = this.sshInfo.user !== 'undefined' ? this.sshInfo.user + '@' + this.sshInfo.host : this.sshInfo.host;
		}else{
			grunt.fatal('Remote server access via rsync requires the SSH host to be defined. "ssh.host" found in "' + this.environment + '" environment\'s configuration.');
		}

	}

	// extends existingOpts with ssh credentials for environment
	RsyncCredsHelper.prototype.opts = function(existingOpts){

		var rsyncOpts = {};

		// maybe add some more options
		if(typeof this.sshInfo.keyfile !== 'undefined'){
			rsyncOpts.privateKey = this.sshInfo.keyfile;
		}else if(typeof this.sshInfo.password !== 'undefined'){
			// they aren't using a key but are using a password. We can't do that.
			grunt.warn('grunt-rsync only supports passwordless SSH authentication.');
		}

		if(typeof this.sshInfo.port !== 'undefined'){
			rsyncOpts.port = this.sshInfo.port;
		}	

		// extend existing options
		if(typeof existingOpts !== 'undefined'){
			rsyncOpts = _.deepExtend(rsyncOpts, existingOpts);
		}

		return rsyncOpts;
		
	}

	RsyncCredsHelper.prototype.getConnectionString = function(){
		return this.sshString;
	}

	return RsyncCredsHelper;

}