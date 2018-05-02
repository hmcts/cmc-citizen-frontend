import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { InterestStartDate } from 'claim/form/models/interestStartDate'

function renderView (form: Form<InterestStartDate>, res: express.Response): void {
  const pastDate: Moment = MomentFactory.currentDate().subtract(1, 'year')

  res.render(Paths.interestStartDatePage.associatedView, {
    form: form,
    pastDate: pastDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestStartDatePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestStartDate), res)
  })
  .post(
    Paths.interestStartDatePage.uri,
    FormValidator.requestHandler(InterestStartDate, InterestStartDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<InterestStartDate> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interestStartDate = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.interestEndDatePage.uri)
      }
    }))
