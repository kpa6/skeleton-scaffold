const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const  pump = require('pump');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const mkdirp = require('mkdirp');
const extend = require('extend')
const webserver = require('gulp-webserver');
const prettyUrl = require("gulp-pretty-url");


var options = {
  srcDir: path.resolve(__dirname, 'src'),
  viewsDir: path.resolve(__dirname, 'src/pages'),
  outputDir: path.resolve(__dirname, 'dist')
};


// Clean up output directory
gulp.task('clean', function () {
  return gulp.src( options.outputDir, {read: false})
    .pipe(clean());
});


// Generate the site pages found in the pages folder
gulp.task('generate', function(){
  return gulp.src(options.viewsDir + '/**/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(prettyUrl())
    .pipe(gulp.dest(options.outputDir))
});


// Compile CSS from Sass
gulp.task('sass', () =>
  gulp.src(['src/sass/base.scss'])
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./src/sass/include']
    }).on('error', sass.logError))
    .pipe(gulp.dest(options.outputDir + '/style'))
);


// compile scripts as required
gulp.task('scripts', function() {
  pump([
    gulp.src(options.srcDir + '/scripts/**/*.js'),
    uglify(),
    gulp.dest(options.outputDir + '/scripts')
  ]);
});


// TODO: investigate local redirects
// serve the static dist folder
gulp.task('serve', function() {
  gulp.src(options.outputDir)
    .pipe(webserver({
      livereload: false,
      open: false
    }));
});


// Watchers
gulp.task('watch', function() {
  gulp.watch([options.srcDir + '/**/*.scss'], ['sass']);
  gulp.watch([options.srcDir + '/**/*.js'], ['scripts']);
  gulp.watch([options.srcDir + '/**/*.pug'], ['generate']);
});


// Ensure any config files make to the dist folder
gulp.task('configs', () =>
  gulp.src(['_redirects'])
    .pipe(gulp.dest(options.outputDir))
);


// run the build in sequence
gulp.task('build', function (cb) {
  runSequence(
    'clean',
    ['generate', 'sass', 'scripts'],
    'configs',
    cb
  );
});


// run, watch and serve the dev build
gulp.task('dev', function (cb) {
  runSequence(
    'build',
    'serve',
    'watch',
    cb
  );
});


// tasks helpers
gulp.task('default', ['dev']);
gulp.task('deploy', ['build']); // TODO & optim & push to netlify
