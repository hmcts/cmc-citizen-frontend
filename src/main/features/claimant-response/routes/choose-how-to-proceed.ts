import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ErrorHandling } from 'shared/errorHandling'
import { FormValidator } from 'forms/validation/formValidator'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { FormaliseRepaymentPlanOption } from 'features/claimant-response/form/models/formaliseRepaymentPlanOption'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'

function renderView (form: Form<FormaliseRepaymentPlan>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.chooseHowToProceedPage.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.chooseHowToProceedPage.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

      renderView(new Form(draft.document.formaliseRepaymentPlan), res, next)
    }
  )
  .post(
    Paths.chooseHowToProceedPage.uri,
    FormValidator.requestHandler(FormaliseRepaymentPlan, FormaliseRepaymentPlan.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FormaliseRepaymentPlan> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.formaliseRepaymentPlan = form.model

        await new DraftService().save(draft, user.bearerToken)

        const externalId: string = req.params.externalId
        if (form.model.option.value === FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value) {
          res.redirect(Paths.signSettlementAgreementPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
