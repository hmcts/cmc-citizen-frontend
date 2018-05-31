import * as express from 'express'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'
import { StatementOfMeansPaths, Paths as Paths } from 'response/paths'

function renderView (form: Form<Explanation>, res: express.Response) {
  res.render(StatementOfMeansPaths.cannotPayImmediatelyPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatementOfMeansPaths.cannotPayImmediatelyPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    renderView(new Form(draft.document.payBySetDate.explanation), res)
  }))
  .post(
    StatementOfMeansPaths.cannotPayImmediatelyPage.uri,
    FormValidator.requestHandler(Explanation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Explanation> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.payBySetDate.explanation = form.model
        await new DraftService().save(draft, user.bearerToken)
        const claim: Claim = res.locals.claim

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
