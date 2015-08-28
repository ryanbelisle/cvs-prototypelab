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


// Task: Build Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});


// Task: Rebuild Jekyll & Page Reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


// Task: Wait for Jekyll Build, then Launch Server
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


// Task: SASS
// gulp.task('sass', function () {
//     return gulp.src('scss/app.scss')
//         .pipe(sass({
//             includePaths: ['scss'],
//             onError: browserSync.notify
//         }))
//         .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//         .pipe(gulp.dest('_site/css'))
//         .pipe(browserSync.reload({stream:true}))
//         .pipe(gulp.dest('css'));
// });


// Task: Sass
gulp.task('sass', function () {
    return gulp.src('scss/app.scss')
        .pipe(sass({includePaths: ['scss']}))
        // Catch any SCSS errors and prevent them from crashing gulp
        .on('error', function (error) {
            console.error(error);
            this.emit('end');
        })
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});


// Task: Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('_site/js'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
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
    //gulp.watch('js/*.js', ['scripts']);
    gulp.watch(['index.html', '_layouts/*.html', 'playground/*.html', '_includes/*', '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['bootstrap', 'sass', 'scripts', 'copyfonts', 'browser-sync', 'watch']);
