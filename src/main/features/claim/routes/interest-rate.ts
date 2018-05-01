import * as express from 'express'
import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { InterestRate } from 'claim/form/models/interestRate'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<InterestRate>, res: express.Response): void {
  res.render(Paths.interestRatePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestRatePage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestRate), res)
  })
  .post(
    Paths.interestRatePage.uri,
    FormValidator.requestHandler(InterestRate, InterestRate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<InterestRate> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestRate = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.interestDatePage.uri)
      }
    }))
