import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { Eligibility } from 'drafts/models/eligibility/eligibility'
import { FormValidator } from 'forms/validation/formValidator'
import User from 'idam/user'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'app/models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/notEligibleReason'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityOver18Page.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.eligibilityOver18Page.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityOver18Page.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, '18-or-over'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.eighteenOrOver = form.model.eighteenOrOver

        await new DraftService().save(user.claimDraft, user.bearerToken)

        if (user.claimDraft.document.eligibility.eighteenOrOver === YesNoOption.NO) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.OVER_18}`)
        } else {
          res.redirect(Paths.eligibilityHelpWithFeesPage.uri)
        }
      }
    })
  )
