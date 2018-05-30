import * as express from 'express'

import { Paths, FullAdmissionPaths, StatementOfMeansPaths } from 'response/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { RoutablePath } from 'shared/router/routablePath'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

function nextPageFor (responseDraft: ResponseDraft): RoutablePath {
  if (StatementOfMeans.isApplicableFor(responseDraft)) {
    return StatementOfMeansPaths.startPage
  } else {
    return Paths.taskListPage
  }
}

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const alreadyPaid: number = draft.document.paidAmount.amount || 0

  res.render(FullAdmissionPaths.paymentPlanPage.associatedView, {
    form: form,
    remainingAmount: claim.totalAmountTillToday - alreadyPaid
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(FullAdmissionPaths.paymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      renderView(new Form(draft.document.fullAdmission.paymentPlan), res)
    }))

  .post(FullAdmissionPaths.paymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission'),
    FormValidator.requestHandler(DefendantPaymentPlan, DefendantPaymentPlan.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response): Promise<void> => {
        const form: Form<DefendantPaymentPlan> = req.body

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft
          const user: User = res.locals.user

          draft.document.fullAdmission.paymentPlan = form.model
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(nextPageFor(draft.document).evaluateUri({ externalId: externalId }))
        }
      }))
