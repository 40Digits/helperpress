HelperPress
======================
A CLI tool for automating & simplifying much of the WordPress multi-environment workflow.

- **Simplified Source Control** - Only track your theme. Use config files for everything else.
- **Environment Management** - Migrates database & uploads between environments
- **Automatically Configure Apache & Hosts** - Automagically configures Apache virtualhosts and hosts for local development
- **Deployment** - Build & Deploy via rsync or Git


## Requirements
*This has only been tested on OS X. It will not work as-is on Windows. It will maybe work on nix*

1. Node.js & npm
2. [Composer](https://getcomposer.org/)
3. `mysql` in your $PATH

## Installation
1. Install HelperPress globally via npm: `npm install helperpress -g`.
1. Setup your [global HelperPress config file](https://github.com/40Digits/helperpress/wiki/Configuration) (`~\.helperpress`)
1. Run `hp init` in your project's repo

Run `hp --help` for a list of commands.

*Learn more in the Documentation at the [GitHub Wiki](https://github.com/40Digits/helperpress/wiki)*