'use strict';
// generated on 2014-09-24 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var program = require('commander');

// load plugins
var $ = require('gulp-load-plugins')();

program.on('--help', function(){
    console.log('  Tasks:');
    console.log();
    console.log('    build       build the application');
    console.log('    clean       delete generated files');
    console.log('    lint        lint files');
    console.log('    watch       watch for file changes and rebuild automatically');
    console.log();
    process.exit();
});

program
    .usage('<task> [options]')
    .option('-P, --prod', 'generate production assets')
    .parse(process.argv);

gulp.task('default', function() {
    program.help();
});

var prod = !!program.prod;

var paths = {
    app : 'app',
    dist : 'dist',
    test : 'test',
}

gulp.task('styles', function () {
    return gulp.src(paths.app + '/styles/styles.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest(paths.dist + '/styles/'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    function browserifyError(err) {
        gutil.log('browserify', gutil.colors.red('(error)'), gutil.colors.gray(err.message));
        this.emit('end');
    }

    var bundler = browserify(['./app/scripts/index.js'], {debug: true})
        .transform('html2js-browserify');

    return bundler.bundle()
        .on('error', browserifyError)
        .pipe(source('build.js'))
        .pipe(gulp.dest(paths.dist + '/scripts/'));
});

gulp.task('vendors', function() {
  return gulp.src([
      paths.app + '/bower_components/jquery/dist/jquery.js',
      paths.app + '/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
    ])
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.size({showFiles: true, gzip: true}))
    .pipe(gulp.dest(paths.dist + '/scripts/'));
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src(paths.app + '/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.if(prod, $.uglify()))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.if(prod, $.csso()))
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest(paths.dist))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src(paths.app + '/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.dist + '/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/fontawesome*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dist + '/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src([paths.app + '/*.*', '!app/*.html'], { dot: true })
        .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', paths.dist], { read: false }).pipe($.rimraf());
});

gulp.task('build', ['html', 'vendors', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static(paths.dist))
        .use(connect.directory(paths.dist))
        ;

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'styles'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src(paths.app + '/styles/*.scss')
        .pipe(wiredep({
            directory: paths.app + '/bower_components'
        }))
        .pipe(gulp.dest(paths.app + '/styles'));

    gulp.src(paths.app + '/*.html')
        .pipe(wiredep({
            directory: paths.app + '/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest(paths.app));
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    gulp.watch('/*.html', ['html']);
    gulp.watch(paths.app + '/styles/**/*.scss', ['styles']);
    gulp.watch(paths.app + '/scripts/**/*.js', ['scripts']);
    gulp.watch(paths.app + '/images/**/*', ['images']);
    gulp.watch(paths.app + '/scripts/**/*.html', ['scripts']);
    gulp.watch('bower.json', ['wiredep']);

    // watch for changes
    gulp.watch([
        paths.app + '/*.html',
        paths.app + '/styles/**/*.css',
        paths.app + '/scripts/**/*.js',
        paths.app + '/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });
});
