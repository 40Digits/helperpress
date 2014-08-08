module.exports = {
	options: {
		args: ["--verbose -L"], // -L: follow symlinks
		exclude: [
			".git*",
			"*.scss",
			"node_modules"
		],
		recursive: true
	},
	dist: {
		options: {
			src: "./",
			dest: "../dist"
		}
	},
	stage: {
		options: {
			src: "../dist/",
			dest: "/var/www/site",
			host: "user@staging-host",
			delete: true // Careful this option could cause data loss, read the docs!
		}
	},
	prod: {
		options: {
			src: "../dist/",
			dest: "/var/www/site",
			host: "user@live-host",
			delete: true // Careful this option could cause data loss, read the docs!
		}
	}
};