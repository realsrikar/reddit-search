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
  rev = require('gulp-rev'),
  revReplace = require('gulp-rev-replace'),
  revDel = require('gulp-rev-delete-original'),
  path = require('path');


gulp.task('lint', function() {
  return gulp.src(['src/js/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('css', function() {
  gulp.src('src/sass/**/*.sass')
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [path.join(__dirname, '/node_modules/')]
    }).on('error', sass.logError))
    .pipe(prefix())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(sourcemap.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concatJS('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/js/'))
});

gulp.task('sw', function() {
  gulp.src('./sw.js')
    .pipe(uglify().on('error', error => console.error(`${error.filename} on (${error.line}:${error.col})`)))
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



gulp.task('images', function() {
  gulp.src('src/img/*')
    .pipe(imagemin([
      png(),
      svg({
        plugins: [{
          removeViewBox: true
        }, {
          cleanupIDs: false
        }]
      }),
      jpg({
        plugins: [{
          target: .5
        }]
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
gulp.task('default', ['watch', 'html', 'js', 'sw', 'css', 'images', 'lint', 'serve']);
gulp.task('watch', function() {
  gulp.watch("src/sass/**/*", ['css']);
  gulp.watch("src/js/*.js", browserSync.reload);
  gulp.watch("src/*.html", ['html']);
  gulp.watch("src/*.html", browserSync.reload);
  gulp.watch('src/js/*.js', ['js', 'lint']);
  gulp.watch('sw.js', ['sw']);
  gulp.watch('src/img/*', ['images'])
});


gulp.task('build-files', ['html', 'js', 'css']);

gulp.task('build-rev', function() {
  gulp.src(['./docs/**/*', '!./docs/*.html', '!**/*.map', '!./docs/img/*', '!./docs/sw.js', '!./docs/*.json'])
  .pipe(rev())
  .pipe(revDel())
  .pipe(gulp.dest('./docs/'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('./docs/'));
});

gulp.task('build-names', function() {
  gulp.src('docs/*.html')
    .pipe(revReplace({
      manifest: gulp.src('./docs/rev-manifest.json')
    }))
      .pipe(gulp.dest('./docs'))
})
