import { TranslationOptions } from 'i18next'
import * as path from 'path'
import * as express from 'express'
import * as config from 'config'
import * as nunjucks from 'nunjucks'
import { dateFilter, dateInputFilter } from 'modules/nunjucks/filters/dateFilter'
import { convertToPoundsFilter } from 'modules/nunjucks/filters/convertToPounds'
import * as numeralFilter from 'nunjucks-numeral-filter'
import * as numeral from 'numeral'
import * as moment from 'moment'
import * as toBoolean from 'to-boolean'

import { NUMBER_FORMAT } from 'app/utils/numberFormatter'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { SignatureType } from 'app/common/signatureType'
import { ResponseType } from 'response/form/models/responseType'
import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/../../features/eligibility/notEligibleReason'
import { EvidenceType } from 'forms/models/evidenceType'
import { StatementType } from 'offer/form/models/statementType'
import { InterestDateType } from 'app/common/interestDateType'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { DashboardUrlHelper } from 'dashboard/helpers/dashboardUrlHelper'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import { ClaimStatus } from 'claims/models/claimStatus'
import { FeatureToggles } from 'utils/featureToggles'
import { Paths as AppPaths } from 'app/paths'
import { Paths as DashboardPaths } from 'features/dashboard/paths'
import { Paths as ResponsePaths } from 'features/response/paths'
import { HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { Service } from 'models/service'

const packageDotJson = require('../../../../package.json')

const appAssetPaths = {
  js: '/js',
  js_vendor: '/js/lib',
  style: '/stylesheets',
  style_vendor: '/stylesheets/lib',
  images: '/img',
  images_vendor: '/img/lib',
  pdf: '/pdf'
}

export class Nunjucks {

  constructor (public developmentMode: boolean, public i18next) {
    this.developmentMode = developmentMode
    this.i18next = i18next
  }

  enableFor (app: express.Express) {
    app.set('view engine', 'njk')
    const nunjucksEnv = nunjucks.configure([
      path.join(__dirname, '..', '..', 'views'),
      path.join(__dirname, '..', '..', 'features'),
      path.join(__dirname, '..', '..', 'views', 'macro'),
      path.join(__dirname, '..', '..', '..', '..', 'node_modules', '@hmcts', 'cmc-common-frontend', 'macros')
    ], {
      autoescape: true,
      throwOnUndefined: true,
      watch: this.developmentMode,
      express: app
    })

    app.use((req, res, next) => {
      res.locals.pagePath = req.path
      next()
    })

    require('numeral/locales/en-gb')
    numeral.locale('en-gb')
    numeral.defaultFormat(NUMBER_FORMAT)

    moment.locale('en-gb')

    nunjucksEnv.addGlobal('asset_paths', appAssetPaths)
    nunjucksEnv.addGlobal('serviceName', 'Money Claims')
    nunjucksEnv.addGlobal('supportEmailAddress', config.get('support.contact-email'))
    nunjucksEnv.addGlobal('development', this.developmentMode)
    nunjucksEnv.addGlobal('govuk_template_version', packageDotJson.dependencies.govuk_template_jinja)
    nunjucksEnv.addGlobal('gaTrackingId', config.get<string>('analytics.gaTrackingId'))
    nunjucksEnv.addGlobal('t', (key: string, options?: TranslationOptions): string => this.i18next.t(key, options))
    nunjucksEnv.addFilter('date', dateFilter)
    nunjucksEnv.addFilter('inputDate', dateInputFilter)
    nunjucksEnv.addFilter('pennies2pounds', convertToPoundsFilter)
    nunjucksEnv.addFilter('numeral', numeralFilter)
    nunjucksEnv.addGlobal('betaFeedbackSurveyUrl', config.get('feedback.feedbackSurvey.url'))
    nunjucksEnv.addGlobal('reportProblemSurveyUrl', config.get('feedback.reportProblemSurvey.url'))
    nunjucksEnv.addGlobal('customerSurveyUrl', config.get('feedback.serviceSurvey.url'))

    nunjucksEnv.addGlobal('featureToggles', this.convertPropertiesToBoolean(config.get('featureToggles')))
    nunjucksEnv.addGlobal('RejectAllOfClaimOption', RejectAllOfClaimOption)
    nunjucksEnv.addGlobal('RejectPartOfClaimOption', RejectPartOfClaimOption)
    nunjucksEnv.addGlobal('DefendantPaymentType', DefendantPaymentType)
    nunjucksEnv.addGlobal('DefendantPaymentOption', DefendantPaymentOption)
    nunjucksEnv.addGlobal('PaymentType', PaymentType)
    nunjucksEnv.addGlobal('SignatureType', SignatureType)
    nunjucksEnv.addGlobal('ResponseType', ResponseType)
    nunjucksEnv.addGlobal('YesNoOption', YesNoOption)
    nunjucksEnv.addGlobal('EvidenceType', EvidenceType)
    nunjucksEnv.addGlobal('StatementType', StatementType)
    nunjucksEnv.addGlobal('NotEligibleReason', NotEligibleReason)
    nunjucksEnv.addGlobal('InterestDateType', InterestDateType)
    nunjucksEnv.addGlobal('ResidenceType', ResidenceType)
    nunjucksEnv.addGlobal('PaymentSchedule', PaymentSchedule)
    nunjucksEnv.addGlobal('DashboardUrlHelper', DashboardUrlHelper)
    nunjucksEnv.addGlobal('UnemploymentType', UnemploymentType)
    nunjucksEnv.addGlobal('BankAccountType', BankAccountType)
    nunjucksEnv.addGlobal('ClaimStatus', ClaimStatus)
    nunjucksEnv.addGlobal('AppPaths', AppPaths)
    nunjucksEnv.addGlobal('DashboardPaths', DashboardPaths)
    nunjucksEnv.addGlobal('ResponsePaths', ResponsePaths)
    nunjucksEnv.addGlobal('HowMuchPaidClaimantOption', HowMuchPaidClaimantOption)
    nunjucksEnv.addGlobal('Service', Service)
    if (FeatureToggles.isEnabled('finePrint')) {
      nunjucksEnv.addGlobal('cookieText', `GOV.UK uses cookies make the site simpler. <a href="${AppPaths.cookiesPage.uri}">Find out more about cookies</a>`)
    }
  }

  private convertPropertiesToBoolean (featureToggles: { [key: string]: any }): { [key: string]: boolean } {
    if (!featureToggles) {
      throw new Error('Feature toggles are not defined')
    }
    return Object.keys(featureToggles).reduce((result: { [key: string]: boolean }, property: string) => {
      result[property] = toBoolean(Object.getOwnPropertyDescriptor(featureToggles, property).value)
      return result
    }, {})
  }
}
