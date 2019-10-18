import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'main/app/forms/models/freeMediation'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'

function renderView (res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.mediationAgreementPage.associatedView, {
    otherParty: claim.otherPartyName(user)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.mediationAgreementPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.mediationAgreementPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<MediationDraft> = res.locals.mediationDraft
      const user: User = res.locals.user

      if (req.body.accept) {
        draft.document.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)

        await new DraftService().save(draft, user.bearerToken)
        if ((user.id === claim.defendantId && claim.claimData.defendant.isBusiness()) ||
            (user.id === claim.claimantId && claim.claimData.claimant.isBusiness())) {
          res.redirect(Paths.canWeUseCompanyPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.canWeUsePage.evaluateUri({ externalId: claim.externalId }))
        }
      } else {
        draft.document.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)
        draft.document.canWeUse = undefined
        draft.document.canWeUseCompany = undefined

        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.continueWithoutMediationPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
