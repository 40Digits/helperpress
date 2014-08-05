var repoName = process.cwd().substr(process.cwd().lastIndexOf('/') + 1),
	validationFuncs = {},

	sudo = require(__dirname + '/../node_modules/apply-sudo');


validationFuncs.notBlank = function(val){
	return val.length > 0 ? true : 'This must not be blank';
}

validationFuncs.noSpecialChars = function(val){
	var valid = !/[^a-zA-Z0-9-_]/.test(val);
	return valid ? true : 'This may only contains numbers, letters, underscores, and dashes.';
}

function setExtendedThemeSettings(answers){
	return answers['_setup_site_config.deep_theme_settings'];
}

var repo_config = {
	options: {
		questions: [
			{
				config: 'setup_site_config.repo.wp.theme.slug', 
				type: 'input', 
				message: 'Enter site slug:', 
				default: repoName,
				validate: validationFuncs.noSpecialChars
			},
			{
				config: 'setup_site_config.repo.wp.theme.name', 
				type: 'input', 
				message: 'Enter site\'s nice name:',
				validate: validationFuncs.notBlank
			},
			{
				config: 'setup_site_config.repo.wp.theme.desc', 
				type: 'input', 
				message: 'Enter site\'s description:',
				// TODO: it would be nice to generate a default based on the site's nice name
				validate: validationFuncs.notBlank
			},
			{
				config: '_setup_site_config.deep_theme_settings', 
				type: 'confirm', 
				message: 'Would you like to setup optional theme settings?',
				default: false
			},

			// Optional Extended Theme settings
			{
				config: 'setup_site_config.repo.wp.theme.author',
				type: 'input',
				message: 'Enter Author:',
				when: setExtendedThemeSettings
			},
			{
				config: 'setup_site_config.repo.wp.theme.author_uri',
				type: 'input',
				message: 'Enter Author URI:',
				when: setExtendedThemeSettings
			},
			{
				config: 'setup_site_config.repo.wp.theme.version',
				type: 'input',
				message: 'Enter Version:',
				when: setExtendedThemeSettings
			},
			{
				config: 'setup_site_config.repo.wp.theme.uri',
				type: 'input',
				message: 'Enter Theme URI:',
				when: setExtendedThemeSettings
			},
			{
				config: 'setup_site_config.repo.wp.theme.tags',
				type: 'input',
				message: 'Enter Tags:',
				when: setExtendedThemeSettings
			},


			// plugins
			// value can be slug (from WP Plugins repo), path to local .zip file, or URL
			{
				config: 'setup_site_config.repo.wp.plugins', 
				type: 'checkbox', 
				message: 'Select WordPress plugins:',
				choices: [
					{
						name: 'WordPress SEO',
						value: 'wordpress-seo',
						checked: true
					},
					{
						name: 'Advanced Custom Fields',
						value: 'advanced-custom-fields',
						checked: true
					}
				]
			}
		]
	}
};

var sudo_pass = {
	options: {
		questions: [
			{
				config: 'sudo_pass', 
				type: 'password', 
				message: 'Some tasks we\'re running need root access. Enter your sudo password:'
			}
		],
		then: function(answers){
			sudo.setPass( answers.sudo_pass );
		}
	}
};

module.exports = {
	repo_config: repo_config,
	sudo_pass: sudo_pass
};

