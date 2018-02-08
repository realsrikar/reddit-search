const gulp = require('gulp'), // 1.

  es = require('event-stream'), // 2.

  browserSync = require('browser-sync').create(), // 3.

  sass = require('gulp-sass'), // 4.
  prefix = require('gulp-autoprefixer'), // 5.

  sourcemap = require('gulp-sourcemaps'), // 6.


  htmlmin = require('gulp-htmlmin'), // 7.

  uglify = require('gulp-uglify-es').default, // 8.
  babel = require('gulp-babel'),
  concat = require('gulp-concat'), // 9.
  eslint = require('gulp-eslint'),

imagemin = require('gulp-imagemin'), // 10.
  png = require('imagemin-pngquant'), // 11. & 12.
  jpg = require('imagemin-jpeg-recompress'), // 12.
  svg = require('imagemin-svgo'); // 11.

// 1. Need for Gulp

// 2. Combine JS & CSS Processes

// 3. Live reload

// 4. Compiles SASS
// 5. Applies vendorprefixes

// 6. Sourcemaps for SASS and JS -- Concatenating and minifing files means lines are not the same in the browser inspector. This creates .map files to correct that. Do not push .map files into production.

// 7. Remove HTML comments and minify

// 8. Minify JS
// 9. Combine all JS and make just one HTTP request

// 10. Imagemin allows us to use plugins
// 11. Doesn't work too well / Despends on the image
// 12. Plugins to minify images


gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['src/js/**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('css', function() {
  const sassnew = gulp.src('src/sass/*.sass')
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
  es.merge(sassnew)
    .pipe(prefix())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  const concatnew = gulp.src('src/js/**/*.js')
    .pipe(sourcemap.init())
    .pipe(concat('bundle.js'));

  const babelnew = gulp.src('src/app.js')
    .pipe(babel({
      presets: ['env']
    }))

  const uglifynew = gulp.src('src/js/build.js');

  es.merge(concatnew, babelnew, uglifynew)
    .pipe(uglify())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/js/'));
});

gulp.task('sw', _ => {
  gulp.src('./sw.js')
    .pipe(uglify())
    .pipe(gulp.dest('docs/'))
})



gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      removeEmptyAttributes: true
    }))
    .pipe(gulp.dest('./docs/'));
});



gulp.task('images', () =>
  gulp.src('src/img/*')
  .pipe(imagemin([
    png(),
    svg({
      plugins: [{
          removeViewBox: true
        },
        {
          cleanupIDs: false
        }
      ]
    }),
    jpg({
      plugins: [{
        target: .5
      }]
    })
  ]))
  .pipe(gulp.dest('docs/img'))
);



gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./docs"
    },
    ui: false,
    port: 7800,
    browser: "Google Chrome",
    open: false,
    notify: false,
    logLevel: 'silent'
  });
});

gulp.task('default', ['watch', 'html', 'js', 'sw', 'css', 'images', 'serve', 'lint']);

gulp.task('watch', function() {
  gulp.watch("src/sass/*", ['css']);
  gulp.watch("src/js/*.js", browserSync.reload);
  gulp.watch("src/*.html", ['html']);
  gulp.watch("src/*.html", browserSync.reload);
  gulp.watch('src/js/*.js', ['js', 'lint']);
  gulp.watch('sw.js', ['sw']);
  gulp.watch('src/img/*', ['images'])
});
