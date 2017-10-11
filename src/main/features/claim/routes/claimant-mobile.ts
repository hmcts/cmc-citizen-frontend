import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { MobilePhone } from 'forms/models/mobilePhone'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<MobilePhone>, res: express.Response): void {
  res.render(Paths.claimantMobilePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantMobilePage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.claimDraft.document.claimant.mobilePhone), res)
  })
  .post(
    Paths.claimantMobilePage.uri,
    FormValidator.requestHandler(MobilePhone, MobilePhone.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<MobilePhone> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.document.claimant.mobilePhone = form.model
        await DraftService.save(res.locals.user.claimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.taskListPage.uri)
      }
    }))
