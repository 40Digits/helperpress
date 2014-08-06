// This is probably pretty dangerous and hacky. ¯\_(ツ)_/¯

var pass;

function setPass(password){
	pass = password;
}

function apply(cmd){
	var passMuliLined, bashWrapped;

	if( typeof pass !== 'string' || pass.length === 0){
		console.log('Error: tried to run sudo without setting password first.');
		process.exit(1);
	}

	// insert newline when using sudo -S
	// http://stackoverflow.com/questions/9402961/adding-newline-characters-to-unix-shell-variables
	passMuliLined = 'PASS=' + pass + '; PASS="$PASS"$\'\\n\' ;';
	// use bash -c "cmd"  http://superuser.com/questions/136646/how-to-append-to-a-file-as-sudo
	bashWrapped = passMuliLined + 'echo "$PASS" | sudo -S bash -c "' + cmd.replace(/"/gi, '\\"') + '"';

	return bashWrapped;
}

module.exports = {
	apply: apply,
	setPass: setPass
}