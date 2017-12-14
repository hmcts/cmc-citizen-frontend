import * as express from 'express'

import { ResponseType } from 'response/form/models/responseType'
import { Paths } from 'response/paths'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

export class OweNoneResponseRequiredGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claim: Claim = res.locals.claim
    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    if (draft.document.response.type === ResponseType.OWE_NONE) {
      next()
    } else {
      res.redirect(Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }))
    }
  }

}
