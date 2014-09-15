var repoName = process.cwd().substr(process.cwd().lastIndexOf('/') + 1),
	validationFuncs = {},

	sudo = require(__dirname + '/../lib/apply-sudo');


validationFuncs.notBlank = function(val){
	return val.length > 0 ? true : 'This must not be blank';
}

validationFuncs.noSpecialChars = function(val){
	var valid = !/[^a-zA-Z0-9-_]/.test(val);
	return valid ? true : 'This may only contains numbers, letters, underscores, and dashes.';
}

function setExtendedThemeSettings(answers){
	return answers['_write_helperpress_config.deep_theme_settings'];
}

var repo_config = {
	options: {
		questions: [
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.slug', 
				type: 'input', 
				message: 'Enter site slug:', 
				default: repoName,
				validate: validationFuncs.noSpecialChars
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.name', 
				type: 'input', 
				message: 'Enter site\'s nice name:',
				validate: validationFuncs.notBlank
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.desc', 
				type: 'input', 
				message: 'Enter site\'s description:',
				// TODO: it would be nice to generate a default based on the site's nice name
				default: 'A custom-built WordPress theme.'
			},
			{
				config: '_write_helperpress_config.deep_theme_settings', 
				type: 'confirm', 
				message: 'Would you like to setup optional theme settings?',
				default: false
			},

			// Optional Extended Theme settings
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.author',
				type: 'input',
				message: 'Enter Author:',
				default: '<%= pkg.author %>',
				when: setExtendedThemeSettings
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.author_uri',
				type: 'input',
				message: 'Enter Author URI:',
				when: setExtendedThemeSettings
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.version',
				type: 'input',
				message: 'Enter Version:',
				default: '<%= pkg.version %>',
				when: setExtendedThemeSettings
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.uri',
				type: 'input',
				message: 'Enter Theme URI:',
				when: setExtendedThemeSettings
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.tags',
				type: 'input',
				message: 'Enter Tags:',
				when: setExtendedThemeSettings
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.license',
				type: 'input',
				message: 'Enter License:',
				default: '<%= pkg.license %>',
				when: setExtendedThemeSettings
			},
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.theme.license_uri',
				type: 'input',
				message: 'Enter License URI:',
				when: setExtendedThemeSettings
			},


			// plugins
			// value can be slug (from WP Plugins repo), path to local .zip file, or URL
			{
				config: 'write_helperpress_config.repo_config.options.settings.wp.plugins', 
				type: 'checkbox', 
				message: 'Select WordPress plugins.',
				choices: [
					{
						name: 'WordPress SEO',
						value: 'wordpress-seo',
						checked: true
					},
					{
						name: 'Advanced Custom Fields',
						value: 'https://www.dropbox.com/s/82j0sfrtn6fazf9/advanced-custom-fields-pro.zip?dl=1',
						checked: true
					},
					{
						name: 'Ninja Forms Core',
						value: 'ninja-forms',
						checked: false
					},
					{
						name: 'Gravity Forms Core',
						value: 'https://www.dropbox.com/s/ykdrq084p7nkjl5/gravityforms.zip?dl=1',
						checked: false
					},
					{
						name: 'Contact Form 7',
						value: 'contact-form-7',
						checked: false
					},
					{
						name: 'Really Simple Captcha',
						value: 'really-simple-captcha',
						checked: false
					},
					{
						name: 'Contact Form 7 DB',
						value: 'contact-form-7-to-database-extension',
						checked: false
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
				message: 'Some tasks we\'re running need root access. Please enter your sudo password:'
			}
		],
		then: function(answers){
			sudo.setPass( answers.sudo_pass );
		}
	}
};

var update = {
	options: {
		questions: [
			{
				config: 'do_update',
				type: 'checkbox',
				message: 'What would you like to update?',
				choices: [
					{
						name: 'WordPress Core',
						value: 'wp_cli:update_core',
						checked: true
					},
					{
						name: 'WordPress Plugins',
						value: 'wp_cli:update_all_plugins',
						checked: true
					},
					{
						name: 'Composer Packages',
						value: 'composer:update',
						checked: true
					},
					{
						name: 'Bower Packages',
						value: 'bower:install',
						checked: true
					}
				]
			}
		]
	}
};

module.exports = {
	repo_config: repo_config,
	sudo_pass: sudo_pass,
	update: update
};

