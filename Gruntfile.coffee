module.exports = (grunt) ->
	grunt.initConfig
		simplemocha:
			all:
				src: ['test/*.js']
				options:
					reporter: 'dot'

		mocha:
			all:
				src: ['test/index.html']
				options:
					run: true

		watch:
			all:
				files: ['base64codec.js', 'test/*.js', 'test/index.html']
				tasks: ['test']

	grunt.loadNpmTasks 'grunt-simple-mocha'
	grunt.loadNpmTasks 'grunt-mocha'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'test', ['simplemocha', 'mocha']
	grunt.registerTask 'default', ['test']
