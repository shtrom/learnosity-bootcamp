const gulp = require('gulp');
const sass = require('gulp-sass');
const minifycss = require('gulp-minify-css');
const importCss = require('gulp-import-css');
const rename = require('gulp-rename');
const del = require('del');

const paths = {
    src: './src',
    dest: './build',
    php: ['./src/*.php'],
    sass: './src/css/*.sass'
};

gulp.task('styles', () => {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(importCss())
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dest + '/css'));
});

gulp.task('php', () => {
    return gulp.src(paths.php)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', () => {
    gulp.watch(paths.src, ['build']);
});

gulp.task('clean', () => {
    return del(paths.dest);
});

gulp.task('build', ['clean', 'styles', 'php']);

gulp.task('default', ['build', 'watch']);