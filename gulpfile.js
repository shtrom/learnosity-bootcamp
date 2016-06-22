const gulp = require('gulp');
const sass = require('gulp-sass');
const minifycss = require('gulp-minify-css');
const importCss = require('gulp-import-css');
const rename = require('gulp-rename');

gulp.task('styles', () => {
    return gulp.src('./public/css/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(importCss())
        .pipe(minifycss())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', () => {
    gulp.watch('public/css/*.sass', ['styles']);
});

gulp.task('default', ['watch'], () => {

});