var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'dist/chrome',
    port: process.env.PORT || 8000,
    livereload: false
  });
});

// gulp.task('default', ['connect']);
