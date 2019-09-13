import * as express from 'express'
import * as path from 'path'

import { CCJPaths, Paths } from 'claimant-response/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { OnlyClaimantLinkedToClaimCanDoIt } from 'guards/onlyClaimantLinkedToClaimCanDoIt'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse'
import { ResponseGuard } from 'response/guards/responseGuard'
import { FormaliseRepaymentPlanOptionFilter } from 'claimant-response/filters/renderFormaliseRepaymentPlanOption'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { BankAccountTypeViewFilter } from 'claimant-response/filters/bank-account-type-view-filter'
import { ResidenceTypeViewFilter } from 'claimant-response/filters/residence-type-view-filter'
import { IncomeTypeViewFilter } from 'claimant-response/filters/income-type-view-filter'
import { ExpenseTypeViewFilter } from 'claimant-response/filters/expense-type-view-filter'
import { AgeGroupTypeViewFilter } from 'claimant-response/filters/age-group-type-view-filter'
import { YesNoViewFilter } from 'claimant-response/filters/yes-no-view-filter'
import { ClaimantResponseGuard } from 'claimant-response/guards/claimantResponseGuard'
import { FrequencyViewFilter } from 'claimant-response/filters/frequency-view-filter'
import { MonthlyAmountViewFilter } from 'claimant-response/filters/monthly-amount-view-filter'
import { PriorityDebtTypeViewFilter } from 'claimant-response/filters/priority-debts-type-view-filter'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

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
      app.settings.nunjucksEnv.globals.ClaimantResponseCCJPath = CCJPaths
      app.settings.nunjucksEnv.globals.FormaliseRepaymentPlanOption = FormaliseRepaymentPlanOption
    }

    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.filters) {
      app.settings.nunjucksEnv.filters.renderFormaliseRepaymentPlanOption = FormaliseRepaymentPlanOptionFilter.render
    }
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.filters) {
      app.settings.nunjucksEnv.filters.renderYesNo = YesNoViewFilter.render
      app.settings.nunjucksEnv.filters.renderBankAccountType = BankAccountTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderResidenceType = ResidenceTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderAgeGroupType = AgeGroupTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderFrequencyViewType = FrequencyViewFilter.render
      app.settings.nunjucksEnv.filters.renderIncomeType = IncomeTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderExpenseType = ExpenseTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderMonthlyAmount = MonthlyAmountViewFilter.render
      app.settings.nunjucksEnv.filters.renderPriorityDebtType = PriorityDebtTypeViewFilter.render
      app.settings.nunjucksEnv.filters.renderPaymentFrequencyView = FrequencyViewFilter.renderPaymentFrequency
    }

    const allClaimantResponse = '/case/*/claimant-response/*'
    app.all(allClaimantResponse, requestHandler())
    app.all(allClaimantResponse, ClaimMiddleware.retrieveByExternalId)
    app.all(allClaimantResponse, OnlyClaimantLinkedToClaimCanDoIt.check())
    app.all(allClaimantResponse, ResponseGuard.checkResponseExists())
    app.all(allClaimantResponse, ResponseGuard.checkResponseExists())
    app.all(/^\/case\/.+\/claimant-response\/claimant-receipt/, OnlyClaimantLinkedToClaimCanDoIt.check())
    app.all(/^\/case\/.+\/claimant-response\/(?!confirmation|claimant-receipt).*$/, ClaimantResponseGuard.checkClaimantResponseDoesNotExist())
    app.all(/^\/case\/.+\/claimant-response\/(?!confirmation|claimant-receipt).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claimantResponse', 100, (value: any): DraftClaimantResponse => {
        return new DraftClaimantResponse().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.claimantResponseDraft
        next()
      })
    app.all(/^\/case\/.+\/claimant-response\/task-list|intention-to-proceed|check-and-send|incomplete-submission.*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'mediation', 100, (value: any): MediationDraft => {
        return new MediationDraft().deserialize(value)
      }))

    app.all(/^\/case\/.+\/claimant-response\/task-list|check-and-send|incomplete-submission.*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'directionsQuestionnaire', 100, (value: any): DirectionsQuestionnaireDraft => {
        return new DirectionsQuestionnaireDraft().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
