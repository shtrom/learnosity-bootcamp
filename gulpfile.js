const gulp = require('gulp');
const sass = require('gulp-sass');
const minifycss = require('gulp-minify-css');
const importCss = require('gulp-import-css');
const rename = require('gulp-rename');
const del = require('del');

const paths = {
    src: './src',
    dest: './build',
    sass: './src/css/*.sass',
    misc: ['./src/**/*.php', './src/**/.htaccess']
};

gulp.task('clean-styles', () => {
    return del(paths.dest + '/css');
});

gulp.task('styles', () => {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(importCss())
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dest + '/css'));
});

gulp.task('clean-misc', () => {
    return del(paths.misc);
});

gulp.task('misc', () => {
    return gulp.src(paths.misc)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', ['build'], () => {
    gulp.watch(paths.src, ['build']);
});

gulp.task('clean', ['clean-misc', 'clean-styles'], () => {
    return del(paths.dest);
});

gulp.task('build', ['styles', 'misc']);

gulp.task('default', ['watch']);