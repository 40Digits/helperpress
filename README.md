WPEngine Site Template
======================

## Requirements
1. npm (via [Homebrew](http://brew.sh/#install): `brew install node`)
2. [Composer](https://getcomposer.org/doc/00-intro.md#globally-on-osx-via-homebrew-)

## Configuration
Before Grunt is initialized, four configuration files are loaded and combined into one giant config JSON object. The files in order of precedence (i.e. early files' settings will override latter ones):

1. site_config.json.local
2. site_config.json
3. ~/.wpe_defaults
4. package.json

### Site Configuration Properties
See the example commented JSON object below for information about each property. These are set in the "config" object in package.json and as root properties in all other config files. *Note that actual JSON files may not have comments in them.*

```js
{

	// Git Subtrees to be installed
	"subtrees": {

		// subtree ID (will also be remote)
		"40d-sass": {

			// where to install it within the main repo
			"path": "wp-theme/assets/_src/sass",

			// repo URL
			"url": "git@bitbucket.org:40digits/40d-semantic-sass-structure.git",

			// which branch to use
			"branch": "master"

		}

	},

	// Associated deployment environments
	"environments": {

		// environment ID
		"development": {

			// human-readable title
			"title": "Development (Dev01)"

			// Server SSH info
			"ssh_host": "dev01.40digits.net",

			// Database settings (using SSH)
			// DO NOT COMMIT CREDENTIALS - use ~/.wpe_default
			"db": {

				"host": "127.0.0.1",
				"pass": "password",
				"user": "db-user"
				"database": "my-wp"

			},

			// path to WP install directory
			"wp_path": "/var/www/vhosts/my-wp",

			// base URL of site
			"home_url": "//my-wp.dev01.40digits.net"
		}

	},

	// ID of environment w/ master database
    "db_master": "",

    // WordPress settings
    "wp": {

    	/*
	    	Theme Settings

	    	Leave a property blank or undefined to infer settings from package.json
	    	(see http://codex.wordpress.org/Theme_Development#Theme_Stylesheet)
    	*/
		"theme" {

			"slug": "wp-theme", 	// Text Domain
			"name": "My WP Theme", 	// Theme Name
			"decription": "" 		// Description
			"author": "", 			// Author
			"author_uri": "", 		// Author URI
			"version": "" 			// Version
			"uri": "", 				// Theme URI
			"tags": "", 			// Tags

		},

		// Plugins - A plugin slug, the path to a local zip file, or URL to a remote zip file.
		"plugins": [
			"akismet",
			"advanced-custom-fields",
	    ]

    },

    // Which browsers should the code be expected to support?
    "browser_support": {

    	"ie": "9" // this structure TBD

    }

}
```


### package.json
This is a standard file required by NPM ([see Grunt documentation](http://gruntjs.com/getting-started#package.json)). This should not need to be changed unless the Gruntfile itself is edited.

#### "config" Object
These settings are related to the unique configuration of this repository's WordPress site. All settings from site_config.json files and the ~/.wpe_defaults are merged into this object.