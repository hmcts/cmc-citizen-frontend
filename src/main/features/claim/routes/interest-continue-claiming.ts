import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { InterestContinueClaiming } from 'claim/form/models/interestContinueClaiming'
import { YesNoOption } from 'models/yesNoOption'

function renderView (form: Form<InterestContinueClaiming>, res: express.Response): void {
  res.render(Paths.interestContinueClaimingPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestContinueClaimingPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestContinueClaiming), res)
  })
  .post(
    Paths.interestContinueClaimingPage.uri,
    FormValidator.requestHandler(InterestContinueClaiming, InterestContinueClaiming.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<InterestContinueClaiming> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestContinueClaiming = form.model

        if (form.model.option === YesNoOption.NO) {
          draft.document.interestHowMuch = undefined
        }

        await new DraftService().save(draft, user.bearerToken)

        if (form.model.option === YesNoOption.NO) {
          res.redirect(Paths.totalPage.uri)
        } else {
          res.redirect(Paths.interestHowMuchPage.uri)
        }
      }
    }))
