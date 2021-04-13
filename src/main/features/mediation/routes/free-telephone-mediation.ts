import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.freeTelephoneMediationPage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    const claim: Claim = res.locals.claim

    res.render(Paths.freeTelephoneMediationPage.associatedView, { defendant: user.id === claim.defendantId })
  })
  .post(
    Paths.freeTelephoneMediationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const draft: Draft<MediationDraft> = res.locals.mediationDraft
      draft.document.willYouTryMediation = new FreeMediation(
        req.body.mediationYes ? FreeMediationOption.YES : FreeMediationOption.NO
      )

      if (draft.document.willYouTryMediation.option === FreeMediationOption.YES) {
        draft.document.mediationDisagreement = undefined
        draft.document.noMediationReason = undefined
      }
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      const claim: Claim = res.locals.claim

      if (req.body.mediationNo) {
        res.redirect(Paths.mediationDisagreementPage.evaluateUri({ externalId }))
      } else if ((user.id === claim.defendantId && claim.claimData.defendant.isBusiness()) ||
            (user.id === claim.claimantId && claim.claimData.claimant.isBusiness())) {
        res.redirect(Paths.canWeUseCompanyPage.evaluateUri({ externalId: claim.externalId }))
      } else {
        res.redirect(Paths.canWeUsePage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
