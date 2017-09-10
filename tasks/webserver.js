var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'dist/chrome',
    process.env.PORT || 8000
    livereload: false
  });
});
// gulp.task('connect-dev', function() {
//   connect.server({
//     root: 'dist/chrome',
//     port: 8000,
//     livereload: true
//   });
// });

gulp.task('default', ['connect']);
