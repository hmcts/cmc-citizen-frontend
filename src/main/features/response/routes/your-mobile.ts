import * as express from 'express'
import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { MobilePhone } from 'forms/models/mobilePhone'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { MediationDraft } from 'mediation/draft/mediationDraft'

function renderView (form: Form<MobilePhone>, res: express.Response) {
  res.render(Paths.defendantMobilePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantMobilePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    renderView(new Form(draft.document.defendantDetails.mobilePhone), res)
  })
  .post(
    Paths.defendantMobilePage.uri,
    FormValidator.requestHandler(MobilePhone),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<MobilePhone> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        if (draft.document.defendantDetails.mobilePhone &&
          draft.document.defendantDetails.mobilePhone.number !== form.model.number && mediationDraft) {
          mediationDraft.document.canWeUseCompany = undefined
          mediationDraft.document.canWeUse = undefined
          await new DraftService().save(mediationDraft, user.bearerToken)
        }

        draft.document.defendantDetails.mobilePhone = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
