import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { InterestDate } from 'claim/form/models/interestDate'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<InterestDate>, res: express.Response): void {
  res.render(Paths.interestDatePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestDatePage.uri, (req: express.Request, res: express.Response) => {
    const draft: DraftClaim = res.locals.draft.document

    renderView(new Form(draft.interestDate), res)
  })
  .post(
    Paths.interestDatePage.uri,
    FormValidator.requestHandler(InterestDate, InterestDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<InterestDate> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestDate = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.feesPage.uri)
      }
    }))
