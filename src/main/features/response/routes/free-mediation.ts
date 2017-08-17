import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'

import { FreeMediation } from 'response/form/models/freeMediation'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

async function renderView (form: Form<FreeMediation>, res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = await ClaimStoreClient.retrieveByDefendantId(res.locals.user.id)

    res.render(Paths.freeMediationPage.associatedView, {
      form: form,
      claimantFullName: claim.claimData.claimant.name
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.freeMediationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.responseDraft.freeMediation), res, next)
  })
  .post(
    Paths.freeMediationPage.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FreeMediation> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        res.locals.user.responseDraft.freeMediation = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.taskListPage.uri)
      }
    }))
