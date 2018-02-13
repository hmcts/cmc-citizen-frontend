const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const plumber = require('gulp-plumber')
const livereload = require('gulp-livereload')
const sass = require('gulp-sass')
const path = require('path')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const fs = require('fs')

const repoRoot = path.join(__dirname, '/')
const govUkFrontendToolkitRoot = path.join(repoRoot, 'node_modules/govuk_frontend_toolkit/stylesheets')
const govUkElementRoot = path.join(repoRoot, 'node_modules/govuk-elements-sass/public/sass')

const assetsDirectory = './src/main/public'
const stylesheetsDirectory = `${assetsDirectory}/stylesheets`

gulp.task('sass', () => {
  gulp.src(stylesheetsDirectory + '/*.scss')
    .pipe(sass({
      includePaths: [
        govUkFrontendToolkitRoot,
        govUkElementRoot
      ]
    }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(stylesheetsDirectory))
    .pipe(livereload())
})

gulp.task('copy-files', () => {
  copyGovUkTemplate()
  copyClientPolyfills()
  copyA11ySniffer()
})

function copyGovUkTemplate () {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/govuk_frontend_toolkit/javascripts/**/*.js',
    './node_modules/govuk_template_jinja/assets/javascripts/**/*.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))

  gulp.src([
    './node_modules/govuk_frontend_toolkit/images/**/*',
    './node_modules/govuk_template_jinja/assets/images/*.*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/img/lib/`))

  gulp.src([
    './node_modules/govuk_template_jinja/assets/stylesheets/**/*'
  ])
    .pipe(replace('images/', '/stylesheets/lib/images/', { skipBinary: true }))
    .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib/`))
}

function copyClientPolyfills () {
  gulp.src('./node_modules/nodelist-foreach-polyfill/index.js')
    .pipe(rename('nodelist-foreach-polyfill.js'))
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))

  gulp.src('./node_modules/classlist-polyfill/src/index.js')
    .pipe(rename('classlist-polyfill.js'))
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))

  gulp.src('./node_modules/string.prototype.startswith/startswith.js')
    .pipe(rename('startswith-polyfill.js'))
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))
}

function copyA11ySniffer () {
  gulp.src([
    './node_modules/HTML_CodeSniffer/HTMLCS.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/Standards/**'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs/Standards`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/Auditor/HTMLCSAuditor.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs/Auditor`))

  gulp.src([
    './node_modules/HTML_CodeSniffer/Auditor/**/*.{css,gif,png}'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib/`))
}

gulp.task('watch', () => {
  gulp.watch(stylesheetsDirectory + '/**/*.scss', [ 'sass' ])
})

gulp.task('develop', () => {
  setTimeout(() => {
    livereload.listen({
      key: fs.readFileSync(path.join(__dirname, 'src', 'main', 'resources', 'localhost-ssl', 'localhost.key'), 'utf-8'),
      cert: fs.readFileSync(path.join(__dirname, 'src', 'main', 'resources', 'localhost-ssl', 'localhost.crt'), 'utf-8'),
    })
    nodemon({
      ext: 'ts js po',
      stdout: true
    }).on('readable', () => {
      this.stdout.on('data', function (chunk) {
        if (/^Application started on port/.test(chunk)) {
          livereload.changed(__dirname)
        }
      })
      this.stdout.pipe(process.stdout)
      this.stderr.pipe(process.stderr)
    })
  }, 500)
})

gulp.task('default', [
  'sass',
  'copy-files',
  'develop',
  'watch'
])
