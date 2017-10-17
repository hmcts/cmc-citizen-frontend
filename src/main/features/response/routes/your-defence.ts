import * as express from 'express'
import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import Defence from 'response/form/models/defence'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { DraftService } from 'services/DraftService'


async function renderView (form: Form<Defence>, res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user

    res.render(Paths.defencePage.associatedView, {
      form: form,
      claim: user.claim
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.defencePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.responseDraft.document.defence), res, next)
  })
  .post(
    Paths.defencePage.uri,
    FormValidator.requestHandler(Defence),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Defence> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.defence = form.model

        await new DraftService()['save'](res.locals.user.responseDraft, res.locals.user.bearerToken)

        res.redirect(Paths.freeMediationPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
