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

gulp.task('clean-php', () => {
    return del(paths.php);
});

gulp.task('php', () => {
    return gulp.src(paths.php)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', ['build'], () => {
    gulp.watch(paths.src, ['build']);
});

gulp.task('clean', ['clean-php', 'clean-styles']);

gulp.task('build', ['styles', 'php']);

gulp.task('default', ['watch']);