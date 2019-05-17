import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

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

      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params

      if (ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
        if (req.body.mediationYes) {
          res.redirect(Paths.mediationAgreementPage.evaluateUri({ externalId }))
        } else {
          res.redirect(Paths.noMediationPage.evaluateUri({ externalId }))
        }
      } else {
        res.redirect(Paths.willYouTryMediation.evaluateUri({ externalId }))
      }
    }))
