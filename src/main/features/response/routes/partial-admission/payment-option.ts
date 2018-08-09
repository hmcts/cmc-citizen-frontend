import * as express from 'express'

import { Claim } from 'claims/models/claim'
import { partialAdmissionPath } from 'response/paths'
import { PaymentOptionPage } from 'response/components/payment-intention/payment-option'
import { ResponseDraft } from 'response/draft/responseDraft'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

const setHowMuchDoYouOweAmount = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const draft: ResponseDraft = res.locals.responseDraft.document
  const claim: Claim = res.locals.claim

  if (draft.isResponsePartiallyAdmitted(claim.features) && draft.partialAdmission.howMuchDoYouOwe) {
    res.locals.amount = draft.partialAdmission.howMuchDoYouOwe.amount || 0
  }

  next()
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage('partialAdmission')
  .buildRouter(partialAdmissionPath, OptInFeatureToggleGuard.featureEnabledGuard('admissions'), setHowMuchDoYouOweAmount)
