// Include gulp
var gulp        = require('gulp');


// Include Our Plugins
var sass        = require('gulp-sass');
var compass     = require('gulp-compass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var minifycss   = require('gulp-minify-css');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;


// Jekyll Build Msg
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


// Build Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});


// Rebuild Jekyll & Page Reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


// Wait for Jekyll Build, then Launch Server
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});


// Task: Bootstrap
gulp.task('bootstrap', function () {
    return gulp.src('scss/bootstrap.scss')
        .pipe(sass())
        // Catch any SCSS errors and prevent them from crashing gulp
        .on('error', function (error) {
            console.error(error);
            this.emit('end');
        })
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('scss/app.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});


// Task: Copy FontAwesome fonts
gulp.task('copyfonts', function() {
   gulp.src('bower_components/fontawesome/fonts/**/*.{ttf,woff,eot,svg,woff2,otf}')
   .pipe(gulp.dest('_site/fonts'))
   .pipe(gulp.dest('fonts'))
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch(['index.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['bootstrap', 'sass', 'copyfonts', 'browser-sync', 'watch']);
