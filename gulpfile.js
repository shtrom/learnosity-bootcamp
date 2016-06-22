const gulp = require('gulp');
const sass = require('gulp-sass');
const minifycss = require('gulp-minify-css');
const importCss = require('gulp-import-css');
const rename = require('gulp-rename');
const del = require('del');

const srcPath = './src';
const destPath = './build';
const sassFiles = destPath + '/public/css/*.sass';
const cssPath = destPath + '/public/css';

gulp.task('styles', ['compile-sass'], () => {
    return del(sassFiles);
});

gulp.task('compile-sass', ['copy'], () => {
    return gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(importCss())
        .pipe(minifycss())
        .pipe(gulp.dest(cssPath));
});

gulp.task('copy', ['clean'], () => {
    return gulp.src(srcPath + '/**/*')
        .pipe(gulp.dest(destPath));
});

gulp.task('watch', ['build'], () => {
    gulp.watch(srcPath, ['build']);
});

gulp.task('clean', () => {
    return del(destPath);
});

gulp.task('build', ['styles', 'copy']);

gulp.task('default', ['watch']);