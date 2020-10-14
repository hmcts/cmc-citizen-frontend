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
const govUkFrontendRoot = path.join(repoRoot, 'node_modules/govuk-frontend/govuk')
const appDirectory = `./src/main/common/components/imported`

const assetsDirectory = './src/main/public'
const stylesheetsDirectory = `${assetsDirectory}/stylesheets`
const webChatDirectory = `${assetsDirectory}/webchat`
const antennaWebChatDirectory = `./src/main/public/assets`
const govUkFronendStylesheets = `${stylesheetsDirectory}/govuk-frontend`

gulp.task('sass', (done) => {
  gulp.src(stylesheetsDirectory + '/*.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: [
        govUkFrontendToolkitRoot,
        govUkElementRoot
      ]
    }))
    .pipe(sass())
    .pipe(gulp.dest(stylesheetsDirectory))
    .pipe(livereload())
    done()
})

gulp.task('copy-files', (done) => {
  copyGovUkTemplate()
  copyWebChatTemplate()
  copyClientPolyfills()
  copyA11ySniffer()
  copyClientModules()
  copyDatePickerDependencies()
  copyComponents()
  copyGovukFrontendFonts()
  done()
})

gulp.task('sass-govuk-frontend', (done) => {
  gulp.src(govUkFrontendRoot + '/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(`${stylesheetsDirectory}/govuk-frontend`))

  gulp.src(govUkFronendStylesheets + '/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(govUkFronendStylesheets))
    .pipe(livereload())
  done()
})

function copyComponent(component) {
  gulp.src([
    `./node_modules/govuk-frontend/govuk/components/${component}/**/*.njk`,
    `./node_modules/govuk-frontend/govuk/components/${component}/**/*.ts`
  ])
    .pipe(gulp.dest(`${appDirectory}/${component}/`))

  gulp.src([
    `./node_modules/govuk-frontend/govuk/components/${component}/**/*.js`,
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/components/${component}/`))
}

function copyComponents () {
  ['tabs'].forEach(copyComponent)
}

function copyGovukFrontendFonts() {
  gulp.src([
    `./node_modules/govuk-frontend/govuk/assets/fonts/**/*.*`,
  ])
    .pipe(gulp.dest(`${assetsDirectory}/assets/fonts/`))
}

function copyWebChatTemplate () {
  gulp.src([
    './node_modules/@hmcts/ctsc-web-chat/assets/javascript/*.js'
  ])
    .pipe(gulp.dest(`${webChatDirectory}/javascript/`))

  gulp.src([
    './node_modules/@hmcts/ctsc-web-chat/assets/css/*.css'
  ])
    .pipe(gulp.dest(`${webChatDirectory}/css/`))

    gulp.src([
      'src/main/public/assets/locale/**/*.*'
    ])
      .pipe(gulp.dest(`${antennaWebChatDirectory}/locale/`))
}

function copyGovUkTemplate () {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/govuk_frontend_toolkit/javascripts/**/*.js',
    './node_modules/govuk_template_jinja/assets/javascripts/**/*.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))

  gulp.src([
    './node_modules/govuk_template_jinja/assets/images/apple-touch-icon.png'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/`))

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
    './node_modules/html_codesniffer/build/HTMLCS.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/htmlcs`))

  gulp.src([
    './node_modules/html_codesniffer/build/**/*.{css,gif,png}'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib/`))
}

function copyClientModules () {
  gulp.src([
    './node_modules/numeral/min/numeral.min.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/numeral`))
  gulp.src([
    './node_modules/numeral/min/locales.min.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/numeral`))
}

function copyDatePickerDependencies () {
  gulp.src([
    './node_modules/lodash/lodash.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib`))
  gulp.src([
    './node_modules/moment/min/moment.min.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib`))
  gulp.src([
    './node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib`))
  gulp.src([
    './node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.standalone.css'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib`))
}

gulp.task('watch', (done) => {
  gulp.watch(stylesheetsDirectory + '/**/*.scss', gulp.series('sass'))
  done()
})

gulp.task('develop', (done) => {
  setTimeout(() => {
    livereload.listen({
      key: fs.readFileSync(path.join(__dirname, 'src', 'main', 'resources', 'localhost-ssl', 'localhost.key'), 'utf-8'),
      cert: fs.readFileSync(path.join(__dirname, 'src', 'main', 'resources', 'localhost-ssl', 'localhost.crt'), 'utf-8'),
    })
    nodemon({
      ext: 'ts js po',
      stdout: true,
      ignore: ['./src/integration-test/', 'src/main/public/js/lib', 'src/test']
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
  done()
})

gulp.task('default',
  gulp.series(
    gulp.parallel(
      'sass',
      'sass-govuk-frontend',
      'copy-files',
    ),
    gulp.parallel(
      'develop',
      'watch'
    )
  )
)
