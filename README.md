![HELPeR](http://www.40digits.com/wp-content/uploads/2014/08/helperpress.png)

HelperPress
======================
A tool for automating much of the WordPress development workflow.

- **Environment Management** - Manages syncing data & wp-content between environments
- **Asset Optimization** - Comes loaded with Grunt tasks that optimize CSS, Javascript, and Images.
- **Dependency Management** - Automates working with WP-CLI, Bower, and Composer to minimize extraneous committed code and simplify update process
- **Automatically Configure Apache & Hosts*** Automagically configures Apache virtualhosts and hosts for local development
- **Deployment** - Build & Deploy via rsync or WPE Git Push
- **Automatic Versioning** - pushes and merges become versioned automatically.

## Installation

1. Run `npm install` in the repo directory.
2. Run `grunt setup_dev`

## Requirements
*This has only been tested on OS X. It will not work as-is on Windows.*

1. Node.js & npm (via [Homebrew](http://brew.sh/#install): `brew install node`)
2. [Composer](https://getcomposer.org/doc/00-intro.md#globally-on-osx-via-homebrew-)

## Grunt Tasks
### `grunt setup`
Called automatically after `npm install`, this is the first task that should be run to initalize every repository.

- Installs Composer components
- Installs Bower components
- Installs and configures WordPress 
- Migrates site data down if site_config.json already exists in the repo
- Creates site_config.local.json

### `grunt watch`

- Compiles SASS
- Starts LiveReload

### `grunt pull_db:environment`
Pulls down the database and runs a search and replace on it, overwriting the local database. Change `environment` to the ID of the environment from which you'd like to pull.

### `grunt pull_uploads:environment`
Pulls down the wp-content/uploads directory. This will also change the `uploads_sync` setting to "rsync" in your site_config.local.json file if it is not defined. If the setting is "rewrite", it will add a rewrite rule to the .htaccess file to load all uploads from the `db_master` environmnet. Change `environment` to the ID of the environment from which you'd like to pull.

## Configuration
Before Grunt is initialized, four configuration files are loaded and combined into one giant config JSON object. The files in order of precedence (i.e. early files' settings will override latter ones):

1. site_config.local.json
2. site_config.json
3. ~/.helperpress
4. package.json

### Guide for Settings Definition Placement

*Where should the setting apply?*          | This Repo              | All Repos
-------------------------------------------|------------------------|-------------------
  **This Environment**                     | site_config.local.json | ~/.helperpress
  **All Environments**                     | site_config.json       | package.json*

######* *package.json "config" object should only be edited in the boilerplate.*

### Site Configuration Properties
See the example commented JSON object below for information about each property. These are set in the "config" object in package.json and as root properties in all other config files. *Note that actual JSON files may not have comments in them.*


#### Environments
These settings will come from **site_config.json**, **site_config.local.json**, &  **~/wpe_defaults**.

General rules:

- If the information is unique to this repository, it'll go in site_config.json or site_config.local.json
- Never commit usernames and passwords (i.e. keep them out of package.json and site_config.json)
- If a setting gets reused across multiple sites, such as your local environment setup or development environment creds, it'll go in ~/.helperpress

```js
{
	"environments": {

		// environment ID
		"development": {

			// human-readable title
			"title": "Development (Dev01)",

			// Server SSH info
			"ssh_host": "dev01.40digits.net",

			// Database settings (using SSH)
			// DO NOT COMMIT CREDENTIALS - use ~/.helperpress or site_config.local.json
			"db": {

				"host": "127.0.0.1",
				"pass": "password",
				"user": "db-user"
				"database": "my-wp"

			},

			// path to WP install directory
			"wp_path": "/var/www/vhosts/my-wp",

			// base URL of site without protocol
			"home_url": "my-wp.dev01.40digits.net",

			/*
			how HP should deploy source (uploads and databases are handled elsewhere)
			"rsync": rsync over SSH
			"git_push": builds, grabs remote's .git folder, rsyncs files, commits, and pushes
			"none": don't allow deploy to run on this environment (e.g. it's handled elsewhere)
			*/
			"deploy_method": "rsync"
		}

	},

	// ID of environment w/ master database. Used for syncing database and uploads
    "db_master": "development",

    /*
    approach for syncing uploads.
    "rewrite" uses Apache rewrites via .htaccess
    "rsync" uses rsync to sync folder down
    */
    "uploads_sync": "rsync"
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
			"license": "",              // License
			"license_uri": "",          // License URI

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

This onel  definitely go in the ***~/.helperpress** file.
```js
{
	"apache": {
		"scheme": "vhost",							// vhost or subdir.
		"sites_dir": "/User/me/Sites"				// your localhost folder. subdir only.
		"vhost_dir": "/etc/apache2/extra/vhosts",	// where your vhost confs go. MUST BE WRITEABLE
		"logs_dir": "/my-sites/logs",				// vhost only
		"a2ensite": false,							// do we need to a2ensite? vhost only
		"as_service": false,						// is Apache running as a service? vhost only
		"url_scheme": "*.local"						// how you do local URLs. use "*" for slug placement.
	}
}
```
#### Browser Support
Currently just used for autoprefixer in CSS files
```js
{

    // Which browsers should the code be expected to support?
    // autoprefixer syntax
    "browser_support": ['last 2 version', 'ie 9'] 

}
```


### package.json
This is a standard file required by NPM ([see Grunt documentation](http://gruntjs.com/getting-started#package.json)). This should not need to be changed unless the Gruntfile itself is edited.