import * as express from 'express'
import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Phone } from 'forms/models/phone'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { MediationDraft } from 'mediation/draft/mediationDraft'

function renderView (form: Form<Phone>, res: express.Response) {
  res.render(Paths.defendantPhonePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantPhonePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    renderView(new Form(draft.document.defendantDetails.phone), res)
  })
  .post(
    Paths.defendantPhonePage.uri,
    FormValidator.requestHandler(Phone),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Phone> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        if (draft.document.defendantDetails.phone &&
          draft.document.defendantDetails.phone.number !== form.model.number && mediationDraft) {
          mediationDraft.document.canWeUseCompany = undefined
          mediationDraft.document.canWeUse = undefined
          await new DraftService().save(mediationDraft, user.bearerToken)
        }

        draft.document.defendantDetails.phone = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
