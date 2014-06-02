var gulp = require('gulp');

var MOCHA_REPORTER = process.env.MOCHA_REPORTER || 'dot';

gulp.task('default', ['test']);

gulp.task('test', ['test:node', 'test:browser']);

gulp.task('test:node', function() {
    return gulp.src(['test/*-test.js'])
        .pipe(mocha());
});

gulp.task('test:browser', function() {
    return gulp.src(['test/*.html'])
        .pipe(mochaPhantom());
});

function mochaPhantom() {
    var mochaPhantom = require('gulp-mocha-phantomjs');
    return mochaPhantom({ reporter: MOCHA_REPORTER });
}

function mocha() {
    var mocha = require('gulp-mocha');
    return mocha({ reporter: MOCHA_REPORTER });
}
