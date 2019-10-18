import { isAfter4pm } from 'shared/dateUtils'
import { InitOptions } from 'i18next'
import * as path from 'path'
import * as express from 'express'
import * as config from 'config'
import * as nunjucks from 'nunjucks'
import {
  addDaysFilter,
  dateWithDayAtFrontFilter,
  dateFilter,
  dateInputFilter,
  monthIncrementFilter
} from 'modules/nunjucks/filters/dateFilter'
import { convertToPoundsFilter } from 'modules/nunjucks/filters/convertToPounds'
import * as numeralFilter from 'nunjucks-numeral-filter'
import * as numeral from 'numeral'
import * as moment from 'moment'
import * as toBoolean from 'to-boolean'

import { NUMBER_FORMAT } from 'utils/numberFormatter'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import {
  PaymentOption as DefendantPaymentOption,
  PaymentType as DefendantPaymentType
} from 'shared/components/payment-intention/model/paymentOption'
import { SignatureType } from 'common/signatureType'
import { ResponseType } from 'response/form/models/responseType'
import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { EvidenceType } from 'forms/models/evidenceType'
import { StatementType } from 'offer/form/models/statementType'
import { InterestDateType } from 'common/interestDateType'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import { ClaimStatus } from 'claims/models/claimStatus'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Paths as AppPaths } from 'paths'
import { Paths as DashboardPaths } from 'features/dashboard/paths'
import { Paths as CCJPaths } from 'features/ccj/paths'
import { Paths as StatePaidPaths } from 'features/paid-in-full/paths'
import { Paths as ClaimantResponsePaths } from 'features/claimant-response/paths'
import { Paths as SettlementAgreementPaths } from 'settlement-agreement/paths'
import { Paths as MediationPaths } from 'mediation/paths'
import { Paths as DirectionsQuestionnairePaths } from 'features/directions-questionnaire/paths'
import { Paths as OrdersPaths } from 'features/orders/paths'
import { Paths as TestingSupportPaths } from 'testing-support/paths'
import { FullRejectionPaths, PartAdmissionPaths, Paths as ResponsePaths } from 'features/response/paths'
import { HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { Service } from 'models/service'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestType } from 'claims/models/interestType'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'
import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'
import { Disability } from 'response/form/models/statement-of-means/disability'
import { yesNoFilter } from 'modules/nunjucks/filters/yesNoFilter'
import { DecisionType } from 'common/court-calculations/decisionType'
import { MadeBy } from 'claims/models/madeBy'
import { PartyType } from 'common/partyType'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { FreeMediationOption } from 'main/app/forms/models/freeMediation'
import { PaymentOption } from 'claims/models/paymentOption'
import { ResponseType as DomainResponseType } from 'claims/models/response/responseType'

const packageDotJson = require('../../../../package.json')

const appAssetPaths = {
  js: '/js',
  js_vendor: '/js/lib',
  webchat: '/webchat',
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
      path.join(__dirname, '..', '..', 'common'),
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
    nunjucksEnv.addGlobal('supportEmailAddress', config.get('secrets.cmc.staff-email'))
    nunjucksEnv.addGlobal('development', this.developmentMode)
    nunjucksEnv.addGlobal('govuk_template_version', packageDotJson.dependencies.govuk_template_jinja)
    nunjucksEnv.addGlobal('gaTrackingId', config.get<string>('analytics.gaTrackingId'))
    nunjucksEnv.addGlobal('t', (key: string, options?: InitOptions): string => this.i18next.t(key, options))
    nunjucksEnv.addFilter('date', dateFilter)
    nunjucksEnv.addFilter('inputDate', dateInputFilter)
    nunjucksEnv.addFilter('dateWithDayAtFront', dateWithDayAtFrontFilter)
    nunjucksEnv.addFilter('addDays', addDaysFilter)
    nunjucksEnv.addFilter('pennies2pounds', convertToPoundsFilter)
    nunjucksEnv.addFilter('monthIncrement', monthIncrementFilter)
    nunjucksEnv.addFilter('numeral', numeralFilter)
    nunjucksEnv.addFilter('yesNo', yesNoFilter)
    nunjucksEnv.addGlobal('isAfter4pm', isAfter4pm)
    nunjucksEnv.addGlobal('betaFeedbackSurveyUrl', config.get('feedback.feedbackSurvey.url'))
    nunjucksEnv.addGlobal('reportProblemSurveyUrl', config.get('feedback.reportProblemSurvey.url'))
    nunjucksEnv.addGlobal('customerSurveyUrl', config.get('feedback.serviceSurvey.url'))

    nunjucksEnv.addGlobal('featureToggles', this.convertPropertiesToBoolean(config.get('featureToggles')))
    nunjucksEnv.addGlobal('RejectAllOfClaimOption', RejectAllOfClaimOption)
    nunjucksEnv.addGlobal('AlreadyPaid', AlreadyPaid)
    nunjucksEnv.addGlobal('DefendantPaymentType', DefendantPaymentType)
    nunjucksEnv.addGlobal('DefendantPaymentOption', DefendantPaymentOption)
    nunjucksEnv.addGlobal('PaymentType', PaymentType)
    nunjucksEnv.addGlobal('InterestRateOption', InterestRateOption)
    nunjucksEnv.addGlobal('SignatureType', SignatureType)
    nunjucksEnv.addGlobal('ResponseType', ResponseType)
    nunjucksEnv.addGlobal('MadeBy', MadeBy)
    nunjucksEnv.addGlobal('CountyCourtJudgmentType', CountyCourtJudgmentType)
    nunjucksEnv.addGlobal('YesNoOption', YesNoOption)
    nunjucksEnv.addGlobal('EvidenceType', EvidenceType)
    nunjucksEnv.addGlobal('StatementType', StatementType)
    nunjucksEnv.addGlobal('NotEligibleReason', NotEligibleReason)
    nunjucksEnv.addGlobal('InterestType', InterestType)
    nunjucksEnv.addGlobal('InterestTypeOption', InterestTypeOption)
    nunjucksEnv.addGlobal('InterestDateType', InterestDateType)
    nunjucksEnv.addGlobal('InterestEndDateOption', InterestEndDateOption)
    nunjucksEnv.addGlobal('FormaliseOption', FormaliseOption)
    nunjucksEnv.addGlobal('ClaimantResponseType', ClaimantResponseType)
    nunjucksEnv.addGlobal('ResidenceType', ResidenceType)
    nunjucksEnv.addGlobal('PaymentSchedule', PaymentSchedule)
    nunjucksEnv.addGlobal('UnemploymentType', UnemploymentType)
    nunjucksEnv.addGlobal('BankAccountType', BankAccountType)
    nunjucksEnv.addGlobal('ClaimStatus', ClaimStatus)

    nunjucksEnv.addGlobal('AppPaths', AppPaths)
    nunjucksEnv.addGlobal('ClaimantResponsePaths', ClaimantResponsePaths)
    nunjucksEnv.addGlobal('DashboardPaths', DashboardPaths)
    nunjucksEnv.addGlobal('CCJPaths', CCJPaths)
    nunjucksEnv.addGlobal('StatePaidPaths', StatePaidPaths)
    nunjucksEnv.addGlobal('ResponsePaths', ResponsePaths)
    nunjucksEnv.addGlobal('MediationPaths', MediationPaths)
    nunjucksEnv.addGlobal('PartAdmissionPaths', PartAdmissionPaths)
    nunjucksEnv.addGlobal('FullRejectionPaths', FullRejectionPaths)
    nunjucksEnv.addGlobal('DirectionsQuestionnairePaths', DirectionsQuestionnairePaths)
    nunjucksEnv.addGlobal('OrdersPaths', OrdersPaths)
    nunjucksEnv.addGlobal('TestingSupportPaths', TestingSupportPaths)

    nunjucksEnv.addGlobal('SettlementAgreementPaths', SettlementAgreementPaths)
    nunjucksEnv.addGlobal('HowMuchPaidClaimantOption', HowMuchPaidClaimantOption)
    nunjucksEnv.addGlobal('MonthlyIncomeType', MonthlyIncomeType)
    nunjucksEnv.addGlobal('MonthlyExpenseType', MonthlyExpenseType)
    nunjucksEnv.addGlobal('PriorityDebtType', PriorityDebtType)
    nunjucksEnv.addGlobal('Service', Service)
    nunjucksEnv.addGlobal('DisabilityStatus', Disability)
    nunjucksEnv.addGlobal('cookieText', `GOV.UK uses cookies make the site simpler. <a href="${AppPaths.cookiesPage.uri}">Find out more about cookies</a>`)
    nunjucksEnv.addGlobal('serviceName', `Money Claims`)
    nunjucksEnv.addGlobal('headingVisible', true)
    nunjucksEnv.addGlobal('DecisionType', DecisionType)
    nunjucksEnv.addGlobal('PartyType', PartyType)
    nunjucksEnv.addGlobal('IncomeExpenseSchedule', IncomeExpenseSchedule)
    nunjucksEnv.addGlobal('FreeMediationOption', FreeMediationOption)
    nunjucksEnv.addGlobal('SignatureType', SignatureType)
    nunjucksEnv.addGlobal('domain', {
      ResponseType: DomainResponseType,
      PaymentOption: PaymentOption,
      PaymentSchedule: PaymentSchedule
    })
    nunjucksEnv.addGlobal('PaymentOption', PaymentOption)
    nunjucksEnv.addGlobal('SignatureType', SignatureType)
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
