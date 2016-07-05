var gulp = require('gulp');
var bower = require('bower');
var del = require('del');
var sh = require('shelljs');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

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
      './www/js/app/app.js',
      './www/js/**/*.js',
      '!./www/js/script.js',
      '!./www/js/**/*.spec.js'
    ],
    customJs: './www/js/app/**/*.js',
    sass: './scss/ionic.app.scss',
    templates: './www/js/app/**/*.html'
  },
  dest: {
    js: './www/js/',
    sass: './www/css/',
    templates: './www/templates'
  },
  watch: {
    js: [
      './www/js/**/*.js',
      '!./www/js/script.js',
      '!./www/js/**/*.spec.js'
    ],
    sass: ['./scss/**/*.scss'],
    templates: ['./www/js/app/**/*.html']
  }
};

/* Tasks
   ========================================================================== */
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
        .pipe(plugins.plumber({
            handleError: errorHandler
        }))
        .pipe(plugins.concat('script.js'))
        // .pipe(plugins.rename({suffix: '.min'}))
        // .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.dest.js));
});

// jshint
gulp.task('jshint', function() {
    return gulp.src(paths.src.customJs)
        .pipe(plugins.plumber({
              handleError: errorHandler
        }))
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(require('jshint-stylish')));
});

// jscs
gulp.task('jscs', function() {
    return gulp.src(paths.src.customJs)
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter());
});

// styles
gulp.task('sass', function(done) {
  gulp.src(paths.src.sass)
    .pipe(plugins.sass())
    .on('error', plugins.sass.logError)
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest(paths.dest.sass))
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dest.sass))
    .on('end', done);
});

// watch
gulp.task('watch', function() {
  gulp.watch(paths.watch.sass, ['sass']);
  gulp.watch(paths.watch.js, ['scripts']);
  gulp.watch(paths.src.customJs, ['jshint', 'jscs']);
  gulp.watch(paths.watch.templates, ['moveTemplates']);
});

gulp.task('tests', function(cb) {
  startTests(false);
});

// part ionic of ionic template
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      plugins.gutil.log('bower', plugins.gutil.colors.cyan(data.id), data.message);
    });
});

// part ionic of ionic template
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + plugins.gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', plugins.gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + plugins.gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

/* ============================================================ */
gulp.task('default', ['clean'], function() {
    gulp.start('moveTemplates', 'scripts', 'jshint', 'jscs', 'tests', 'sass', 'watch');
});


/////////////////////
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var args = require('yargs').argv;
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var serverSpecs = 'www/js/app/**/*.spec.js';

    if (args.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !!singleRun
    });
}
