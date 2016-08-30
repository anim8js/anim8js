'use strict';

var gulp = require('gulp');
var dependencies = require('wiredep')();

gulp.task( 'js', function() {
  return gulp.src( dependencies.js ).pipe( gulp.dest('./assets/js/') );
});

gulp.task( 'default', ['js'] );
