var gulp = require('gulp'),
    imagemin = require('gulp-imagemin');
    del = require('del'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

gulp.task('previewDist', function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "dist"
        }
    });
})

gulp.task('deleteDistFolder', function(){
    return del('./dist');
});

gulp.task('copyGeneralFiles', ['deleteDistFolder'], function(){
    var pathsToCpy = [
        './app/**/*',
        '!./app/index.html',
        '!./app/assets/images/**',
        '!./app/assets/styles/**',
        '!./app/assets/scripts/**',
        '!./app/temp',
        '!./app/**'

    ]
    return gulp.src(pathsToCpy)
        .pipe(gulp.dest("./dist"));
});

gulp.task('optimizeImages', ['deleteDistFolder', 'icons'], function(){
    return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
        .pipe(imagemin({
            progressive: true, // optimize jpeg images
            interlaced: true, // for gif images
            multipass: true // for svg files
        }))
        .pipe(gulp.dest("./dist/assets/images"));
});

gulp.task('usemin', ['deleteDistFolder', 'styles', 'scripts'], function(){
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [function() {return rev()}, function() {return cssnano()}],
            js: [function() {return rev()}, function() {return uglify()}]
        }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles',  'optimizeImages', 'usemin']);