import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { Defence } from 'response/form/models/defence'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

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

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    await renderView(new Form(draft.document.defence), res, next)
  })
  .post(
    Paths.defencePage.uri,
    FormValidator.requestHandler(Defence),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Defence> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.defence = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
