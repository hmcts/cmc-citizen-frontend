import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { Logger } from '@hmcts/nodejs-logging'

import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'response/paths'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

const logger = Logger.getLogger('response/guards/responseGuard')

export class FullRejectionGuard {

  static requestHandler (): express.RequestHandler {

    function isRequestAllowed (res: express.Response): boolean {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const claim: Claim = res.locals.claim

      return ClaimFeatureToggles.areAdmissionsEnabled(claim) && draft.document.isResponseRejected()
    }

    function accessDeniedCallback (req: express.Request, res: express.Response): void {
      const claim: Claim = res.locals.claim
      logger.warn('Full Rejection Guard: user tried to access page for full rejection flow')
      res.redirect(Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }))
    }

    return GuardFactory.create(isRequestAllowed, accessDeniedCallback)
  }
}
