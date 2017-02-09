var gulp = require('gulp'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin');

util.beep();

var bases = {
    dist: './dist/',
    server: './dist/views/',
    src: './src/',
    bower: './src/lib/bower_components/'
};

var files = {
    scripts: [
        bases.src+'scripts/main.js',
        bases.src+'scripts/**/*.js',
        bases.src+'controllers/angular.js',
        bases.src+'controllers/**/*.js',
    ],
    styles: [
        bases.src+'styles/main.scss',
        bases.src+'styles/**/*.scss',
    ],
    views: [
        bases.src+'views/*.pug',
        bases.src+'views/**/*.pug',
    ],
    images: [
        bases.src+'lib/images/*.{gif,jpg,png,svg}',
        bases.src+'lib/images/**/*.{gif,jpg,png,svg}',
    ],
    lib: {
        scripts: [
            bases.bower+'jquery/dist/jquery.min.js',
            bases.bower+'jquery-ui/jquery-ui.min.js',
            bases.bower+'angular/angular.min.js',
            bases.bower+'bootstrap/dist/js/bootstrap.min.js',
            bases.bower+'parallax.js/parallax.min.js',
            bases.bower+'**/*.min.js',
            bases.src+'lib/js/*.js'
        ],
        styles: [
            bases.bower+'bootstrap/dist/css/bootstrap.min.css',
            bases.src+'lib/css/*.css',
            bases.bower+'hover/css/hover-min.css',
        ],
        fonts: [
            bases.bower+'bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}',
            bases.src+'lib/fonts/*.{eot,svg,ttf,woff,woff2}'
        ]
    }
};

/** 
 *  Lib build! Run once, unless files updated
 */

gulp.task('lib-scripts', function() {
    return gulp.src(files.lib.scripts + files.scripts)
        .pipe(concat('lib.script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(bases.dist+'lib/scripts/'));
});

gulp.task('lib-styles', function() {
    return gulp.src(files.lib.styles + files.styles)
        .pipe(concat('style.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(bases.dist+'lib/styles/'));
});

gulp.task('lib-fonts', function() {
    return gulp.src(files.lib.fonts)
        .pipe(gulp.dest(bases.dist+'lib/fonts/'));
});

gulp.task('images', function(cb) {
    gulp.src(files.images)
        .pipe(imagemin())
        .pipe(gulp.dest(bases.dist+'images/')).on('end', cb).on('error', cb);
});

/**
 *  Custom build
 *  Watched
 */

gulp.task('views', function() {
    return gulp.src(files.views)
    .pipe(plumber({
        errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
            util.beep();
        }}))
    .pipe(pug({ 
        layout: false,
        pretty: true 
    }))
    .pipe(gulp.dest(bases.dist+'views/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('pug-watch', ['views'], browserSync.reload);

gulp.task('styles', function(){
    return gulp.src(files.styles)
    .pipe(plumber({
        errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
            util.beep();
        }}))
    .pipe(sass({
        outputStyle: 'expanded',
        errLogToConsole: true
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(bases.dist+'styles/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function(){
    return gulp.src(files.scripts)
    .pipe(plumber({
        errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
            util.beep();
        }}))
    .pipe(concat('main.js'))
    // .pipe(gulp.dest('dist/scripts/'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest(bases.dist+'scripts/'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 *  Server
 *  
 */

gulp.task('server', function() {
    return browserSync({
        open: false,
        port: 9001,
        notify: false,
        ghostMode: false,
        server: {
            baseDir: bases.dist
        }
    });
});

/**
 *  Run once
 *  
 */

gulp.task('init', function () {
    return runSequence('lib-scripts', 'lib-styles', 'lib-fonts', 'images');
});

gulp.task('default', ['server', 'styles', 'views'], function(){
    gulp.watch(bases.src+"/styles/**/*.scss", ['styles']);
    gulp.watch(bases.src+"/controllers/**/*.js", ['scripts']);
    gulp.watch(bases.src+"/scripts/**/*.js", ['scripts']);
    gulp.watch(bases.src+"/views/**/*.pug", ['pug-watch']);
});