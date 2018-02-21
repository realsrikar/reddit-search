const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer'),
  sourcemap = require('gulp-sourcemaps'),
  htmlmin = require('gulp-htmlmin'),
  uglify = require('gulp-uglify-es').default,
  babel = require('gulp-babel'),
  eslint = require('gulp-eslint'),
  concatJS = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  png = require('imagemin-pngquant'),
  jpg = require('imagemin-jpeg-recompress'),
  svg = require('imagemin-svgo'),
  swPrecache = require('sw-precache'),
  path = require('path');

gulp.task('lint', function() {
  return gulp.src(['src/js/**/*.js', '!node_modules/**'])
    .pipe(eslint().on('error', err => console.log(err)))
    .pipe(eslint.format().on('error', err => console.log(err)))
    .pipe(eslint.failAfterError().on('error', err => console.log(err)));
});

gulp.task('css', function() {
  gulp.src('src/sass/**/*.sass').pipe(sourcemap.init()).pipe(sass({
    outputStyle: 'compressed',
    includePaths: [path.join(__dirname, '/node_modules/')]
  }).on('error', sass.logError))
    .pipe(prefix())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(sourcemap.init())
    .pipe(babel({presets: ['env']}))
    .pipe(concatJS('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/js/'))
});

gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true, removeEmptyAttributes: true}))
    .pipe(gulp.dest('./docs/'));
});

gulp.task('images', function() {
  gulp.src('src/img/*')
    .pipe(imagemin([
    png(),
    svg({
      plugins: [
        {
          removeViewBox: true
        }, {
          cleanupIDs: false
        }
      ]
    }),
    jpg({
      plugins: [
        {
          target: .5
        }
      ]
    })
  ]))
    .pipe(gulp.dest('docs/img'))
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./docs"
    },
    ui: false,
    port: 7800,
    browser: "Google Chrome",
    open: false,
    online: false,
    notify: false,
    logLevel: 'silent'
  });
});
gulp.task('default', [
  'watch',
  'html',
  'js',
  'sw',
  'css',
  'images',
  'lint',
  'serve'
]);
gulp.task('watch', function() {
  gulp.watch("src/sass/**/*", ['css']);
  gulp.watch("src/js/*.js", browserSync.reload);
  gulp.watch("src/*.html", ['html']);
  gulp.watch("src/*.html", browserSync.reload);
  gulp.watch('src/js/*.js', ['js', 'lint']);
  gulp.watch('sw.js', ['sw']);
  gulp.watch('src/img/*', ['images'])
});

gulp.task('build', (cb) => {
  swPrecache.write(`./docs/sw.js`, {
    staticFileGlobs: ['./docs/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: './docs/'
  }, cb);
});

gulp.task('sw', function() {
  gulp.src('./docs/sw.js')
    .pipe(uglify().on('error', error => console.error(`${error.filename} on (${error.line}:${error.col})`)))
    .pipe(gulp.dest('./docs/'))
})
