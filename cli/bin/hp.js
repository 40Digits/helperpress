#!/usr/bin/env node

'use strict';


var cli = require('commander'),
	findup = require('findup-sync'),

	pkg = require(__dirname + '/../../package.json'),
	runGrunt = require(__dirname + '/../libs/grunt.js');

// determine current HP project path
var projectPath = findup( 'helperpress.json', { cwd: process.cwd(), nocase: true } );

// if no helperpress.json file found, use CWD
if(!projectPath){
	projectPath = process.cwd();
} else {
	// strip filename out to get path
	projectPath = projectPath.substring(0, projectPath.lastIndexOf('/')+1);
}

// mapping of HelperPress's Grunt tasks to commands we'll accept
var taskWhitelist = {
	'init': {
		desc: 'Initialize a HelperPress project in the current directory & install it.',
		options: [
			{
				opt: 'skip-install',
				camel: 'skipInstall',
				desc: 'Skip install after initilization'
			}
		]
	},
	'install': {
		desc: 'Generate local config, migrate data in, build a WP install and configure Apache to serve it.'
	},
	'build [build-type]': {
		desc: 'Build a full WordPress install based on build type (dev or dist) in current project. [dist]'
	},
	'pull [data-type] [environment]':{
		desc: 'Pulls down the remote WP data type (db, uploads or both) from specified environment. [both] [_master]'
	},
	'push [data-type] [environment]':{
		desc: 'Push up the remote WP data type (db, uploads or both) to specified environment. [both] [_master]'
	},
	'deploy [environment]': {
		desc: 'Deploy current checked-out code to environment. [<current branch>]'
	}
};

// Grunt options we will pass on through
// from https://github.com/gruntjs/grunt/blob/master/lib/grunt/cli.js
var gruntOptionsWhitelist = {
	color: {
		info: 'Disable colored output.',
		type: Boolean,
		negate: true
	},
	debug: {
		short: 'd',
		info: 'Enable debugging mode for tasks that support it.',
		type: [Number, Boolean]
	},
	stack: {
		info: 'Print a stack trace when exiting with a warning or fatal error.',
		type: Boolean
	},
	force: {
		short: 'f',
		info: 'A way to force your way past warnings. Want a suggestion? Don\'t use this option, fix your code.',
		type: Boolean
	},
	write: {
		info: 'Disable writing files (dry run).',
		type: Boolean,
		negate: true
	},
	verbose: {
		short: 'v',
		info: 'Verbose mode. A lot more information output.',
		type: Boolean
	}

};

// register the grunt global options
for(var opt in gruntOptionsWhitelist){
	
	var optionStr = '--' + opt;

	if(typeof gruntOptionsWhitelist[opt].short === 'string')
		optionStr = '-' + gruntOptionsWhitelist[opt].short + ', ' + optionStr;

	cli.option(optionStr, gruntOptionsWhitelist[opt].info);
}

// Set CLI version
cli.version(pkg.version);


// Parse the input we've been given
cli.parseOptions(process.argv);

var gruntOpts = {};

// add grunt's global flags
for(var opt in gruntOptionsWhitelist){
	if(typeof cli[opt] !== 'undefined')
		gruntOpts[opt] = cli[opt];
}


// Loop through the task white list and register HP tasks as commands
var cliCommand;

for(var cmd in taskWhitelist){
	
	cliCommand = cli.command(cmd);

	// add description if defined
	if(typeof taskWhitelist[cmd].desc !== 'undefined')
		cliCommand = cliCommand.description(taskWhitelist[cmd].desc);

	// handle options if defined
	if(Array.isArray(taskWhitelist[cmd].options)){
		taskWhitelist[cmd].options.forEach(function(option){

			var optString = '';

			if(typeof option.flag !== 'undefined')
				optString = option.flag + ', ';

			optString += '--' + option.opt;

			// add options to command definition
			cliCommand = cliCommand.option(optString, option.desc);

		});
	}

	// add action for command
	cliCommand = cliCommand.action(getActionHandler(cmd));
}


// handle commands we haven't defined
cli
  .command('*')
  .action(function(){
    console.log('Command not found.');
    cli.help();
  });



// Parse the CLI input and execute that beast
cli.parse(process.argv);


function getActionHandler(cmd){
	return function(){
	  	var gruntTasks = [cmd];

  		// loop through args and build grunt task arr
  		for(var arg in arguments){
  			switch(typeof arguments[arg]){
  				case 'string':
	  				gruntTasks.push(arguments[arg]);
	  				break;

  				case 'object':
					// add specified option(s) to our list of options to pass to grunt
					if(Array.isArray(taskWhitelist[cmd].options)){
						var thatArg = arguments[arg];
						taskWhitelist[cmd].options.forEach(function(option){
							if(typeof thatArg[option.camel] !== 'undefined')
								gruntOpts[option.opt] = thatArg[option.camel];
						});
					}
	  				break;
  			}
  		}

		runGrunt(gruntTasks.join(':'), gruntOpts, projectPath);
	};
}
