import * as express from 'express'

import { Paths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { CanWeUse } from 'mediation/form/models/CanWeUse'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'

function renderView (form: Form<CanWeUse>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  let phoneNumber: string

  if (!claim.isResponseSubmitted()) {
    const draftResponse: Draft<ResponseDraft> = res.locals.responseDraft
    phoneNumber = draftResponse.document.defendantDetails.phone ? draftResponse.document.defendantDetails.phone.number : undefined
  } else {
    phoneNumber = claim.claimData.claimant.phone
  }
  res.render(Paths.canWeUsePage.associatedView, {
    form: form,
    phoneNumber: phoneNumber
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.canWeUsePage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<MediationDraft> = res.locals.mediationDraft

    renderView(new Form(draft.document.canWeUse), res)
  })
  .post(
    Paths.canWeUsePage.uri,
    FormValidator.requestHandler(CanWeUse, CanWeUse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<CanWeUse> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        draft.document.canWeUse = form.model

        if (form.model.option === FreeMediationOption.YES) {
          draft.document.canWeUse.mediationPhoneNumber = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        if (!claim.isResponseSubmitted()) {
          res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    })
  )
