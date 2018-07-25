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
import { ResponseGuard } from 'response/guards/responseGuard'

import { BankAccountTypeViewFilter } from 'claimant-response/filters/bank-account-type-view-filter'
import { ResidenceTypeViewFilter } from 'claimant-response/filters/residence-type-view-filter'
import { PaymentScheduleTypeViewFilter } from 'claimant-response/filters/payment-schedule-type-view-filter'
import { IncomeTypeViewFilter } from 'claimant-response/filters/income-type-view-filter'
import { ExpenseTypeViewFilter } from 'claimant-response/filters/expense-type-view-filter'

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
      app.settings.nunjucksEnv.filters.renderBankAccountType = BankAccountTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderResidenceType = ResidenceTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderPaymentScheduleType = PaymentScheduleTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderIncomeType = IncomeTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderExpenseType = ExpenseTypeViewFilter.render
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
