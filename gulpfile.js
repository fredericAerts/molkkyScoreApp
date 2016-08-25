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
    src: {
        js: [
            './www/lib/angular-translate/angular-translate.js',
            './www/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            './www/lib/underscore/underscore.js',
            './js/app/app.js',
            './js/**/*.js',
            '!./js/script.js',
            '!./js/**/*.spec.js'
        ],
        customJs: './js/app/**/*.js',
        sass: './scss/style.scss',
        templates: './js/app/**/*.html'
    },
    dest: {
        js: './www/js/',
        sass: './www/css/'
    },
    clean: {
        js: './www/js/*.js',
        css: './www/css/*.css'
    },
    watch: {
        js: [
            './js/**/*.js',
            '!./js/script.js',
            '!./js/**/*.spec.js'
        ],
        sass: [
            './scss/*.scss',
            './scss/**/*.scss',
        ]
    }
};

/* Tasks
   ========================================================================== */
// clean
gulp.task('clean', function() {
    return del([paths.clean.js, paths.clean.css], {force: true});
});

// scripts
gulp.task('scripts', function() {
    return gulp.src(paths.src.js)
        .pipe(plugins.plumber({
            handleError: errorHandler
        }))
        .pipe(plugins.concat('script.js'))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
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
    .pipe(plugins.cssnano({
        discardComments: {
            removeAll: true
        }
    }))
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dest.sass))
    .on('end', done);
});

// watch
gulp.task('watch', function() {
    gulp.watch(paths.watch.sass, ['sass']);
    gulp.watch(paths.watch.js, ['scripts']);
    gulp.watch(paths.src.customJs, ['jshint', 'jscs']);
});

gulp.task('tests', function(cb) {
    // return startTests(true);
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
    gulp.start('scripts', 'jshint', 'jscs', 'tests', 'sass', 'watch');
});

/////////////////////

function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var args = require('yargs').argv;
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var serverSpecs = __dirname + '/js/app/**/*.spec.js';

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
