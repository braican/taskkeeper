var gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
    gulp.src('./css/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

 
gulp.task('sass:watch', function () {
    gulp.watch('./css/scss/*.scss', ['sass']);
});

gulp.task('default', ['sass:watch']);