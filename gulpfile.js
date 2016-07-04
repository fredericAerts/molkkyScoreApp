var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var del = require('del');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var errorHandler = function(err) {
    console.log(err);
    this.emit('end');
};

/* Config
   ========================================================================== */
var paths = {
  clean: {
    js: './www/js/*.js'
  },
  src: {
    js: [
      './www/js/**/app.js',
      './www/js/**/*.js',
      '!./www/js/script.js',
      '!./www/js/**/*.spec.js'
    ],
    sass: './scss/ionic.app.scss',
    templates: './www/js/app/**/*.html'
  },
  dest: {
    js: './www/js/',
    sass: './www/css/',
    templates: './www/templates'
  },
  watch: {
    js: ['./www/js/**/*.js'],
    sass: ['./scss/**/*.scss'],
    templates: ['./www/js/app/**/*.html']
  }
};

// clean
gulp.task('clean', function() {
    return del([paths.clean.js], {force: true});
});

// move templates
gulp.task('moveTemplates', function() {
    return gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.dest.templates));
});



// scripts
gulp.task('scripts', function() {
    return gulp.src(paths.src.js)
        .pipe(plumber({
            handleError: errorHandler
        }))
        .pipe(concat('script.js'))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.dest.js));
});

gulp.task('sass', function(done) {
  gulp.src(paths.src.sass)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest(paths.dest.sass))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dest.sass))
    .on('end', done);
});

gulp.task('watch', function() {
  // gulp.watch(paths.watch.sass, ['sass']);
  gulp.watch(paths.watch.js, ['scripts']);
  gulp.watch(paths.watch.templates, ['moveTemplates']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

/* ============================================================ */
gulp.task('default', ['clean'], function() {
    gulp.start('moveTemplates', 'scripts', 'sass', 'watch');
});
