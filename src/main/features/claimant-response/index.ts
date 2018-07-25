import * as express from 'express'
import * as path from 'path'

import { Paths } from 'claimant-response/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { OnlyClaimantLinkedToClaimCanDoIt } from 'guards/onlyClaimantLinkedToClaimCanDoIt'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { ResponseGuard } from 'response/guards/responseGuard'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class ClaimantResponseFeature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.ClaimantResponsePaths = Paths
    }
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.filters) {
      app.settings.nunjucksEnv.filters.bankAccountLabel = function (value: string): string {
        return BankAccountType.valueOf(value).displayValue
      }
      app.settings.nunjucksEnv.filters.residenceLabel = function (value: string): string {
        return ResidenceType.valueOf(value).displayValue
      }
      app.settings.nunjucksEnv.filters.paymentScheduleLabel = function (value: string): string {
        return PaymentSchedule.of(value).displayValue
      }
      app.settings.nunjucksEnv.filters.incomeLabel = function (value: string): string {
        switch (value) {
          case 'JOB' :
            return 'Income from your job'
          case 'UNIVERSAL_CREDIT' :
            return 'Universal Credit'
          case 'JOB_SEEKERS_ALLOWANCE_INCOME_BASES' :
            return 'Jobseeker’s Allowance (income based)'
          case 'JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED' :
            return 'Jobseeker’s Allowance (contribution based)'
          case 'INCOME_SUPPORT' :
            return 'Income Support'
          case 'WORKING_TAX_CREDIT' :
            return 'Working Tax Credit'
          case 'CHILD_TAX_CREDIT' :
            return 'Child Tax Credit'
          case 'CHILD_BENEFIT' :
            return 'Child Benefit'
          case 'COUNCIL_TAX_SUPPORT' :
            return 'Council Tax Support'
          case 'PENSION' :
            return 'Pension (paid to you)'
          case 'OTHER' :
            return 'Other'
        }
      }
      app.settings.nunjucksEnv.filters.expenseLabel = function (value: string): string {
        switch (value) {
          case 'MORTGAGE' :
            return 'mortgage'
          case 'RENT' :
            return 'rent'
          case 'COUNCIL_TAX' :
            return 'Council Tax'
          case 'GAS' :
            return 'gas'
          case 'ELECTRICITY' :
            return 'electricity'
          case 'WATER' :
            return 'water'
          case 'TRAVEL' :
            return 'travel'
          case 'SCHOOL_COSTS' :
            return 'school costs'
          case 'FOOD_HOUSEKEEPING' :
            return 'food and housekeeping'
          case 'TV_AND_BROADBAND' :
            return 'TV and broadband'
          case 'HIRE_PURCHASES' :
            return 'hire purchases'
          case 'MOBILE_PHONE' :
            return 'mobile phone'
          case 'MAINTENANCE_PAYMENTS' :
            return 'maintenance'
          case 'OTHER' :
            return 'Other'
        }
      }
    }

    const allClaimantResponse = '/case/*/claimant-response/*'
    app.all(allClaimantResponse, requestHandler())
    app.all(allClaimantResponse, ClaimMiddleware.retrieveByExternalId)
    app.all(allClaimantResponse, OnlyClaimantLinkedToClaimCanDoIt.check())
    app.all(allClaimantResponse, ResponseGuard.checkResponseExists())
    app.all(/^\/case\/.+\/claimant-response\/(?!confirmation).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claimantResponse', 100, (value: any): DraftClaimantResponse => {
        return new DraftClaimantResponse().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
