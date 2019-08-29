import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Claim } from 'claims/models/claim'

function renderView (res: express.Response): void {
  res.render(Paths.howMediationWorksPage.associatedView, {
    mediationPilot: ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.howMediationWorksPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.howMediationWorksPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const draft: Draft<MediationDraft> = res.locals.mediationDraft
      draft.document.willYouTryMediation = new FreeMediation(
        req.body.mediationYes ? FreeMediationOption.YES : FreeMediationOption.NO
      )

      if (ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
        if (draft.document.willYouTryMediation .option === FreeMediationOption.YES) {
          draft.document.mediationDisagreement = undefined
        }
        await new DraftService().save(draft, user.bearerToken)
      }
      const { externalId } = req.params

      if (req.body.mediationNo) {
        const claim: Claim = res.locals.claim

        if (ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
          res.redirect(Paths.mediationDisagreementPage.evaluateUri({ externalId }))
        } else if (!claim.isResponseSubmitted()) {
          res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      } else if (ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
        res.redirect(Paths.mediationAgreementPage.evaluateUri({ externalId }))
      } else {
        res.redirect(Paths.willYouTryMediation.evaluateUri({ externalId }))
      }
    }))
