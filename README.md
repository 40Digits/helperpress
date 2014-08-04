WPEngine Site Template
======================

## Installation
Run `npm install` in the repo directory. ![(boom)](https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/boom.gif "(boom)")

## Requirements
1. Node.js & npm (via [Homebrew](http://brew.sh/#install): `brew install node`)
2. [Composer](https://getcomposer.org/doc/00-intro.md#globally-on-osx-via-homebrew-)


## Configuration
Before Grunt is initialized, four configuration files are loaded and combined into one giant config JSON object. The files in order of precedence (i.e. early files' settings will override latter ones):

1. site_config.local.json
2. site_config.json
3. ~/.wpe_defaults
4. package.json

### Site Configuration Properties
See the example commented JSON object below for information about each property. These are set in the "config" object in package.json and as root properties in all other config files. *Note that actual JSON files may not have comments in them.*


#### Environments
These settings will come from **site_config.json**, **site_config.local.json**, &  **~/wpe_defaults**.

General rules:

- If the information is unique to this repository, it'll go in site_config.json or site_config.local.json
- Never commit usernames and passwords (i.e. keep them out of package.json and site_config.json)
- If a setting gets reused across multiple sites, such as your local environment setup or development environment creds, it'll go in ~/.wpe-defaults
```js
{
	"environments": {

		// environment ID
		"development": {

			// Server type (currently just LAMP and WPE)
			"type": "lamp",

			// human-readable title
			"title": "Development (Dev01)",

			// Server SSH info
			"ssh_host": "dev01.40digits.net",

			// Database settings (using SSH)
			// DO NOT COMMIT CREDENTIALS - use ~/.wpe_default or site_config.local.json
			"db": {

				"host": "127.0.0.1",
				"pass": "password",
				"user": "db-user"
				"database": "my-wp"

			},

			// path to WP install directory
			"wp_path": "/var/www/vhosts/my-wp",

			// base URL of site without protocol
			"home_url": "my-wp.dev01.40digits.net"
		}

	},

	// ID of environment w/ master database. This will change as we approach launch
    "db_master": "development"
}
```

#### WordPress
```js
{
    "wp": {

    	/*
	    	Theme Settings

	    	Leave a property blank or undefined to infer settings from package.json
	    	(see http://codex.wordpress.org/Theme_Development#Theme_Stylesheet)
    	*/
		"theme" {

			"slug": "wp-theme", 		// Text Domain
			"name": "Client's Site",	// Theme Name
			"decription": "" 			// Description
			"author": "", 				// Author
			"author_uri": "", 			// Author URI
			"version": "" 				// Version
			"uri": "", 					// Theme URI
			"tags": "", 				// Tags

		},

		// Plugins - A plugin slug, the path to a local zip file, or URL to a remote zip file.
		"plugins": [
			"akismet",
			"advanced-custom-fields",
	    ]

    }
}
```

#### Apache Config
Everyone's Apache setup is unique, so you can describe the local environment's setup here.
```js
{
	"apache": {
		"scheme": "vhost",				// vhost or subdir.
		"sites_dir": "/User/me/Sites"	// your localhost folder. subdir only.
		"logs_dir": "/my-sites/logs",	// vhost only
		"a2ensite": false,				// do we need to a2ensite? vhost only
		"as_service": false,			// is Apache running as a service? vhost only
		"url_scheme": "*.local"			// how you do local URLs. use "*" for slug placement.
	}
}
```
#### Browser Support
Currently just used for autoprefixer in CSS files
```js
{

    // Which browsers should the code be expected to support?
    "browser_support": {

    	"ie": "9" // this structure TBD

    }

}
```


### package.json
This is a standard file required by NPM ([see Grunt documentation](http://gruntjs.com/getting-started#package.json)). This should not need to be changed unless the Gruntfile itself is edited.