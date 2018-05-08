import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { InterestTotal } from 'claim/form/models/interestTotal'

function renderView (form: Form<InterestTotal>, res: express.Response): void {
  res.render(Paths.interestTotalPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestTotalPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestTotal), res)
  })
  .post(
    Paths.interestTotalPage.uri,
    FormValidator.requestHandler(InterestTotal, InterestTotal.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<InterestTotal> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestTotal = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.interestContinueClaimingPage.uri)
      }
    }))
