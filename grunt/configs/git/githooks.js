module.exports = {
	all: {
		options: {
			template: 'hooks/pre-commit.js'
		},
		'pre-commit': 'jshint phplint'
	}
};