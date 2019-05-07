import * as express from 'express'

import { AbstractFreeMediationPage } from 'shared/components/free-mediation/free-mediation'

import { responsePath, Paths } from 'features/response/paths'
import { ResponseDraft } from 'response/draft/responseDraft'

import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { Claim } from 'claims/models/claim'

class FreeMediationPage extends AbstractFreeMediationPage {
  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

const populateAmountRequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const claim: Claim = res.locals.claim
  const draft: ResponseDraft = res.locals.responseDraft.document
  res.locals.amount = ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && draft.isResponsePartiallyAdmitted() ? draft.partialAdmission.howMuchDoYouOwe.amount : 0
  next()
}

/* tslint:disable:no-default-export */
export default new FreeMediationPage()
  .buildRouter(responsePath, populateAmountRequestHandler)
