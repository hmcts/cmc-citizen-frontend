import { Logger } from '@hmcts/nodejs-logging'
const logger = Logger.getLogger('app.ts')

import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as favicon from 'serve-favicon'
import * as cookieParser from 'cookie-parser'
import * as cookieEncrypter from '@hmcts/cookie-encrypter'
import * as bodyParser from 'body-parser'
import { ForbiddenError, NotFoundError } from 'errors'
import { ErrorLogger } from 'logging/errorLogger'
import { RouterFinder } from 'shared/router/routerFinder'
import { Config as HelmetConfig, Helmet } from 'modules/helmet'
import { I18Next } from 'modules/i18n'
import { Nunjucks } from 'modules/nunjucks'
import * as moment from 'moment'
import { Feature as EligibilityFeature } from 'eligibility/index'
import { Feature as ClaimIssueFeature } from 'claim/index'
import { Feature as DefendantFirstContactFeature } from 'first-contact/index'
import { Feature as DefendantResponseFeature } from 'response/index'
import { Feature as SettlementAgreementFeature } from 'settlement-agreement/index'
import { CsrfProtection } from 'modules/csrf'
import { DashboardFeature } from 'dashboard/index'
import { CCJFeature } from 'ccj/index'
import { Feature as OfferFeature } from 'offer/index'
import { TestingSupportFeature } from 'testing-support/index'
import { FeatureToggles } from 'utils/featureToggles'
import { ClaimantResponseFeature } from 'claimant-response/index'
import { PaidInFullFeature } from 'paid-in-full/index'
import { MediationFeature } from 'mediation/index'
import { DirectionsQuestionnaireFeature } from 'features/directions-questionnaire'
import { OrdersFeature } from 'orders/index'
import { trackCustomEvent } from 'logging/customEventTracker'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

logger.info('Creating express server object')

export const app: express.Express = express()

const env = process.env.NODE_ENV || 'development'
app.locals.ENV = env

const developmentMode = env === 'development'

const i18next = I18Next.enableFor(app)

new Nunjucks(developmentMode, i18next)
  .enableFor(app)
new Helmet(config.get<HelmetConfig>('security'), developmentMode)
  .enableFor(app)

// Before the page routers themselves, inject custom variables
logger.info('Creating LaunchDarkly Client')
const launchDarklyClient = new LaunchDarklyClient()

logger.info('Loading feature toggles')
const featureToggles = new FeatureToggles(launchDarklyClient)
app.use(/^\/(?!js|img|pdf|stylesheets).*$/, async (req, res, next) => {
  app.settings.nunjucksEnv.globals.warningBanner = await featureToggles.isWarningBannerEnabled()
  app.settings.nunjucksEnv.globals.signPosting = await featureToggles.isSignPostingEnabled()
  app.settings.nunjucksEnv.globals.helpWithFeesFeature = await featureToggles.isHelpWithFeesEnabled()
  next()
})

app.enable('trust proxy')
app.use(favicon(path.join(__dirname, '/public/img/lib/favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}))
app.use(cookieParser())
app.use(cookieEncrypter(config.get('secrets.cmc.encryptionKey'), {
  options: {
    algorithm: 'aes128'
  }
}))

// Web Chat
logger.info('Enabling webchat feature')
app.use('/webchat', express.static(path.join(__dirname, '/public/webchat')))
app.use(express.static(path.join(__dirname, 'public')))

if (env !== 'mocha') {
  new CsrfProtection().enableFor(app)
}

logger.info('Loading EligibilityFeature')
new EligibilityFeature().enableFor(app)

logger.info('Loading DashboardFeature')
new DashboardFeature().enableFor(app)

logger.info('Loading ClaimIssueFeature')
new ClaimIssueFeature().enableFor(app)

logger.info('Loading DefendantFirstContactFeature')
new DefendantFirstContactFeature().enableFor(app)

logger.info('Loading DefendantResponseFeature')
new DefendantResponseFeature().enableFor(app)

logger.info('Loading CCJFeature')
new CCJFeature().enableFor(app)

logger.info('Loading OfferFeature')
new OfferFeature().enableFor(app)

logger.info('Loading SettlementAgreementFeature')
new SettlementAgreementFeature().enableFor(app)

logger.info('Loading MediationFeature')
new MediationFeature().enableFor(app)

logger.info('Loading PaidInFullFeature')
new PaidInFullFeature().enableFor(app)

logger.info('Loading ClaimantResponseFeature')
new ClaimantResponseFeature().enableFor(app)

if (FeatureToggles.isEnabled('testingSupport')) {
  logger.info('FeatureToggles.testingSupport enabled')
  new TestingSupportFeature().enableFor(app)
}

if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
  logger.info('FeatureToggles.directionsQuestionnaire enabled')
  new DirectionsQuestionnaireFeature().enableFor(app)
  new OrdersFeature().enableFor(app)

}

// Below method overrides the moment's toISOString method, which is used by RequestPromise
// to convert moment object to String
moment.prototype.toISOString = function () {
  return this.format('YYYY-MM-DD[T]HH:mm:ss.SSS')
}

logger.info('Loading routes')
app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))

// Below will match all routes not covered by the router, which effectively translates to a 404 response
app.use((req, res, next) => {
  res.setHeader('Server', 'N/A')
  next(new NotFoundError(req.path))
})

// error handlers
const errorLogger = new ErrorLogger()
// exported for testability
export const errorHandler = (err, req, res, next) => {
  errorLogger.log(err)
  res.status(err.statusCode || 500)
  if (err.statusCode === 302 && err.associatedView) {
    res.redirect(err.associatedView)
  } else if (err.associatedView) {
    res.render(err.associatedView)
  } else if (err.statusCode === 403) {
    res.render(new ForbiddenError().associatedView)
  } else {
    const view = FeatureToggles.isEnabled('returnErrorToUser') ? 'error_dev' : 'error'
    if (err.name === 'Template render error') {
      trackCustomEvent('CMC Dashboard Failure', { error: err })
    }
    res.render(view, {
      error: err,
      title: 'error'
    })
  }
  next()
}
app.use(errorHandler)
