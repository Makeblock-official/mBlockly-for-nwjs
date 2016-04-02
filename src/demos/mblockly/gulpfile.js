// Load gulp
var gulp = require('gulp');

// Load plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var rename = require('gulp-rename');
var del = require("del");
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');    

// Styles
gulp.task('css', function() {
    var files = [
        "css/*.css",
        "!css/font/**/*.*"
    ];
    gulp.src(files)
        .pipe(concat('mblockly.css'))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets'))
});

// Scripts
gulp.task('js', function() {
    var files = [
        "js/vendors/acorn_interpreter.js",
        "js/vendors/zepto.min.js",
        "js/mblockly.sliderinput.js",
        "js/mblockly.numpadinput.js",
        "js/mblockly.pianoinput.js",

        "js/block_keeper.js",
        "js/runtime.js",
        "js/blocks_start.js",
        "js/blocks_move.js",
        "js/blocks_display.js",
        "js/blocks_event.js",
        "js/blocks_detect.js",
        "js/blocks_event.js",

        "js/vendors/zepto.min.js",
        "js/resources.js",
        "js/data.js",
        "js/control.js",
        "js/action.js",
        "js/init.js",
        "js/app.js"
    ];
    gulp.src(files)
        // .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('mblockly.js'))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('assets'));
});


// svg sprites
// var svgSprite = require("gulp-svg-sprites");

// gulp.task('sprites', function () {
//     gulp.start('clear');
//     return gulp.src('images/**/*.svg')
//         .pipe(svgSprite({
//             mode: "symbols"
//         }))
//         .pipe(gulp.dest("assets/images/"));
// });


// Clean
gulp.task('clear', function(cb) {
    del(['assets'], cb);
});

// Default task
gulp.task('default', ['clear'], function() {  
    gulp.start('css', 'js');
});
