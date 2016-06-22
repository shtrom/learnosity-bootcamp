var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var importCss = require('gulp-import-css');
var rename = require('gulp-rename');

gulp.task('styles', function() {
    return gulp.src('./public/css/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(importCss())
        .pipe(minifycss())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', function() {
    gulp.watch('public/css/*.sass', ['styles']);
});

gulp.task('default', ['watch'], function() {

});