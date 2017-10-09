import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as favicon from 'serve-favicon'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as logging from '@hmcts/nodejs-logging'
import { NotFoundError } from './errors'
import { ErrorLogger } from 'logging/errorLogger'
import { RouterFinder } from 'common/router/routerFinder'
import { Config as HelmetConfig, Helmet } from 'modules/helmet'
import I18Next from 'modules/i18n'
import Nunjucks from 'modules/nunjucks'

import { Feature as ClaimIssueFeature } from 'claim/index'
import { Feature as DefendantFirstContactFeature } from 'first-contact/index'
import { Feature as DefendantResponseFeature } from 'response/index'
import { CsrfProtection } from 'modules/csrf'
import { DashboardFeature } from 'dashboard/index'
import { CCJFeature } from 'ccj/index'
import { TestingSupportFeature } from 'testing-support/index'
import * as toBoolean from 'to-boolean'

export const app: express.Express = express()

logging.config({
  microservice: 'citizen-frontend',
  team: 'cmc',
  environment: process.env.NODE_ENV
})

const logger = require('@hmcts/nodejs-logging')
  .getLogger('app')

const env = process.env.NODE_ENV || 'development'
app.locals.ENV = env

const developmentMode = env === 'development'

const i18next = I18Next.enableFor(app)

new Nunjucks(developmentMode, i18next)
  .enableFor(app)
new Helmet(config.get<HelmetConfig>('security'), developmentMode)
  .enableFor(app)

app.enable('trust proxy')
app.use(favicon(path.join(__dirname, '/public/img/lib/favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())

if (!developmentMode) {
  app.use(logging.express.accessLogger())
}

app.use(express.static(path.join(__dirname, 'public')))

if (env !== 'mocha') {
  new CsrfProtection().enableFor(app)
}

new DashboardFeature().enableFor(app)
new ClaimIssueFeature().enableFor(app)
new DefendantFirstContactFeature().enableFor(app)
new DefendantResponseFeature().enableFor(app)
if (toBoolean(config.get<boolean>('featureToggles.countyCourtJudgment'))) {
  new CCJFeature().enableFor(app)
}
if (toBoolean(config.get<boolean>('featureToggles.testingSupport'))) {
  logger.info('Testing support activated')
  new TestingSupportFeature().enableFor(app)
}

app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))

// Below will match all routes not covered by the router, which effectively translates to a 404 response
app.use((req, res, next) => {
  next(new NotFoundError(req.path))
})

// error handlers
const errorLogger = new ErrorLogger()
app.use((err, req, res, next) => {
  errorLogger.log(err)
  res.status(err.statusCode || 500)
  if (err.statusCode === 302 && err.associatedView) {
    res.redirect(err.associatedView)
  } else if (err.associatedView) {
    res.render(err.associatedView)
  } else {
    const view = (env === 'mocha' || env === 'development' || env === 'dev' || env === 'dockertests' || env === 'demo') ? 'error_dev' : 'error'
    res.render(view, {
      error: err,
      title: 'error'
    })
  }
  next()
})
