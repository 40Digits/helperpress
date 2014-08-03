var repoName = process.cwd().substr(process.cwd().lastIndexOf('/') + 1),
	validationFuncs = {};


validationFuncs.notBlank = function(val){
	return val.length > 0 ? true : 'This must not be blank';
}

validationFuncs.noSpecialChars = function(val){
	var valid = !/[^a-zA-Z0-9-_]/.test(val);
	return valid ? true : 'This may only contains numbers, letters, underscores, and dashes.';
}

module.exports = {
	repo_config: {
		options: {
			questions: [
				{
					config: 'prompt_setup_config.wp.theme.slug', 
					type: 'input', 
					message: 'Enter site slug:', 
					default: repoName,
					validate: validationFuncs.noSpecialChars
				},
				{
					config: 'prompt_setup_config.wp.theme.name', 
					type: 'input', 
					message: 'Enter site\'s nice name:',
					validate: validationFuncs.notBlank
				},
				{
					config: 'prompt_setup_config.wp.theme.desc', 
					type: 'input', 
					message: 'Enter site\'s description:',
					// TODO: it would be nice to generate a default based on the site's nice name
					validate: validationFuncs.notBlank
				},
				{
					config: '_prompt_setup_config.deep_theme_settings', 
					type: 'confirm', 
					message: 'Would you like to setup optional theme settings?'
				},

				// Optional Theme settings
				{
					config: 'prompt_setup_config.wp.theme.', 
					type: 'confirm', 
					message: 'Would you like to setup optional theme settings?'
				},


				{
					config: 'prompt_setup_config.wp.plugins', 
					type: 'checkbox', 
					message: 'Select WordPress plugins:',
					choices: [
						{
							name: 'Akismet',
							value: 'akismet',
							checked: true
						},
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
	}
};

