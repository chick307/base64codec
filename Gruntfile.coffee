module.exports = (grunt) ->
	grunt.initConfig
		mochaTest:
			dist: ['test/*.js']

		mocha:
			all: ['test/index.html', 'test/issue-3.html']
			options:
				run: true

		watch:
			all:
				files: ['base64codec.js', 'test/*.js', 'test/index.html']
				tasks: ['test']

	grunt.loadNpmTasks 'grunt-mocha-test'
	grunt.loadNpmTasks 'grunt-mocha'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'test', ['mochaTest', 'mocha']
	grunt.registerTask 'default', ['test']
