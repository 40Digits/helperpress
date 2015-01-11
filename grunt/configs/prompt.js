module.exports = function(grunt){
	var validationFuncs = {}, 
		exposedAsAsked = {},

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

	function exposeAsAsked(value, index){
		exposedAsAsked[index] = value;
	}

	function themeNameFromPath(themePath){
		var lastIndexSlash = themePath.lastIndexOf('\\'),
			themeName = themePath;

		if(lastIndexSlash > -1)
			themeName = themePath.substr(0, lastIndexSlash + 0);

		return themeName;
	}

	var repo_config = {
		options: {
			questions: [
				{
					config: 'write_helperpress_config.repo_config.options.settings.theme_path',
					type: 'input',
					message: 'Relative path to distributable WordPress Theme',
					filter: function(val){
						// since prompt doesn't let you access responses til everything has
						// been asked, we have to expose the response ourselves
						exposeAsAsked(val, 'theme_path');
						return val;
					},
					default: '<%= helperpress.theme_path %>'
				},
				{
					config: 'write_helperpress_config.repo_config.options.settings.css_path',
					type: 'input',
					message: 'Relative path to primary CSS source',
					default: '<%= helperpress.css_path %>'
				},
				{
					config: 'write_helperpress_config.repo_config.options.settings.build_cmd',
					type: 'input',
					message: 'CLI command to build for distribution',
					default: '<%= helperpress.build_cmd %>'
				},
				{
					config: 'write_helperpress_config.repo_config.options.settings.build_cmd_dir',
					type: 'input',
					message: 'Directory to run build command from within (relative to repo root)',
					default: '<%= helperpress.build_cmd_dir %>'
				},
				{
					config: 'write_helperpress_config.repo_config.options.settings.wp.theme.slug',
					type: 'input',
					message: 'Enter site slug:',
					validate: validationFuncs.noSpecialChars,
					default: function(){
						return themeNameFromPath(exposedAsAsked.theme_path);
					}
				},
				{
					config: 'write_helperpress_config.repo_config.options.settings.wp.theme.name',
					type: 'input',
					message: 'Enter site\'s nice name:',
					validate: validationFuncs.notBlank,
					default: '<%= helperpress.wp.theme.name %>'
				},
				{
					config: 'write_helperpress_config.repo_config.options.settings.wp.theme.desc',
					type: 'input',
					message: 'Enter site\'s description:',
					// TODO: it would be nice to generate a default based on the site's nice name
					default: '<%= helperpress.wp.theme.desc %>'
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
					choices: '<%= helperpress.default_plugins %>'
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

	return {
		repo_config: repo_config,
		sudo_pass: sudo_pass,
		update: update
	};
};

