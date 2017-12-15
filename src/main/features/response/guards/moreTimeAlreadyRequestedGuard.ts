import * as express from 'express'
import { Paths } from 'response/paths'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

export class MoreTimeAlreadyRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const claim: Claim = res.locals.claim
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    if (draft.document.isMoreTimeRequested()) {
      res.redirect(Paths.moreTimeConfirmationPage.evaluateUri({ externalId: claim.externalId }))
    } else {
      next()
    }
  }
}
