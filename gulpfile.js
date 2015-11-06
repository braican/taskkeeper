var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    svgmin     = require('gulp-svgmin'),
    svgstore   = require('gulp-svgstore');


gulp.task('sass', function () {
    gulp.src('./css/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

 
gulp.task('watch', function () {
    gulp.watch('./css/scss/*.scss', ['sass']);
});

// svg store
gulp.task('svgstore', function () {
    return gulp.src('svg/**/*.svg')
            .pipe(rename({prefix: 'icon--'}))
            .pipe( svgmin() )
            .pipe(svgstore({
                inlineSvg: true
            }))
            .pipe( rename('icons.svg') )
            .pipe(gulp.dest('svg/build'));
});

gulp.task('default', ['sass', 'svgstore']);