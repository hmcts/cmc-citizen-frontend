import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Form } from 'main/app/forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'main/app/idam/user'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'main/app/forms/models/freeMediation'
import { Claim } from 'claims/models/claim'

async function renderView (form: Form<FreeMediation>, res: express.Response) {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  const hint = user.id === claim.defendantId ? 'We’ll ask the claimant if they’ll try free mediation. If they say no, the claim will go to a hearing.' : ''

  res.render(Paths.mediationDisagreementPage.associatedView, {
    form: form,
    defendant: user.id === claim.defendantId,
    hint: hint
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.mediationDisagreementPage.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<MediationDraft> = res.locals.mediationDraft
      await renderView(new Form(draft.document.mediationDisagreement), res)
    }
  )
  .post(
    Paths.mediationDisagreementPage.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FreeMediation> = req.body
      if (form.hasErrors()) {
        await renderView(form, res)
      } else {
        const draft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        draft.document.mediationDisagreement = form.model

        if (form.model.option === FreeMediationOption.NO) {
          draft.document.youCanOnlyUseMediation = undefined
          draft.document.canWeUse = undefined
          draft.document.canWeUseCompany = undefined
        } else {
          draft.document.noMediationReason = undefined
          draft.document.willYouTryMediation = form.model
        }

        await new DraftService().save(draft, user.bearerToken)

        const claim: Claim = res.locals.claim

        handleMediationJourney(form, user, claim, res)
      }
    })
  )

function handleMediationJourney (form: Form<FreeMediation>, user: User, claim: Claim, res: express.Response) {
  if (form.model.option === FreeMediationOption.YES) {
    if (isBusinessUser(user, claim)) {
      res.redirect(Paths.canWeUseCompanyPage.evaluateUri({ externalId: claim.externalId }))
    } else {
      res.redirect(Paths.canWeUsePage.evaluateUri({ externalId: claim.externalId }))
    }
  } else {
    res.redirect(Paths.iDontWantFreeMediationPage.evaluateUri({ externalId: claim.externalId }))
  }
}

function isBusinessUser (user: User, claim: Claim) {
  return (user.id === claim.defendantId && claim.claimData.defendant.isBusiness()) ||
    (user.id === claim.claimantId && claim.claimData.claimant.isBusiness())
}
