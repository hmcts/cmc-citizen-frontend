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
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { CanWeUseCompany } from 'mediation/form/models/CanWeUseCompany'
import { CompanyDetails } from 'forms/models/companyDetails'

function renderView (form: Form<CanWeUseCompany>, res: express.Response): void {
  res.render(Paths.canWeUseCompanyPage.associatedView, {
    form: form,
    contactName: getContactName(res)
  })
}

function getPhoneNumber (res: express.Response) {
  const claim: Claim = res.locals.claim
  if (!claim.isResponseSubmitted()) {
    const draftResponse: Draft<ResponseDraft> = res.locals.responseDraft
    return draftResponse.document.defendantDetails.mobilePhone ? draftResponse.document.defendantDetails.mobilePhone.number : undefined
  } else {
    return claim.claimData.claimant.mobilePhone
  }
}

function getContactName (res: express.Response) {
  const claim: Claim = res.locals.claim
  if (!claim.isResponseSubmitted()) {
    const draftResponse: Draft<ResponseDraft> = res.locals.responseDraft
    return (draftResponse.document.defendantDetails.partyDetails as CompanyDetails).contactPerson ? (draftResponse.document.defendantDetails.partyDetails as CompanyDetails).contactPerson : undefined
  } else {
    return (claim.claimData.claimant as CompanyDetails).contactPerson
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.canWeUseCompanyPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<MediationDraft> = res.locals.mediationDraft

    if (!draft.document.canWeUseCompany) {
      draft.document.canWeUseCompany = CanWeUseCompany.fromObject({ mediationPhoneNumberConfirmation: getPhoneNumber(res) })
    }

    renderView(new Form(draft.document.canWeUseCompany), res)
  })
  .post(
    Paths.canWeUseCompanyPage.uri,
    FormValidator.requestHandler(CanWeUseCompany, CanWeUseCompany.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const claim: Claim = res.locals.claim
      const form: Form<CanWeUseCompany> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user
        draft.document.canWeUseCompany = form.model

        if (form.model.option === FreeMediationOption.YES) {
          draft.document.canWeUseCompany.mediationContactPerson = undefined
          draft.document.canWeUseCompany.mediationPhoneNumber = undefined
        } else {
          draft.document.canWeUseCompany.mediationPhoneNumberConfirmation = undefined
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
