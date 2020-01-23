import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ErrorHandling } from 'shared/errorHandling'
import { FormValidator } from 'forms/validation/formValidator'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

function renderView (form: Form<FormaliseRepaymentPlan>, res: express.Response) {
  res.render(Paths.chooseHowToProceedPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.chooseHowToProceedPage.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

      renderView(new Form(draft.document.formaliseRepaymentPlan), res)
    }
  )
  .post(
    Paths.chooseHowToProceedPage.uri,
    FormValidator.requestHandler(FormaliseRepaymentPlan, FormaliseRepaymentPlan.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FormaliseRepaymentPlan> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.formaliseRepaymentPlan = form.model

        switch (form.model.option) {
          case FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT:
            delete draft.document.paidAmount
            delete draft.document.settlementAgreement
            break
          case FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT:
            delete draft.document.settlementAgreement
            break
        }
        await new DraftService().save(draft, user.bearerToken)

        const externalId: string = req.params.externalId
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
