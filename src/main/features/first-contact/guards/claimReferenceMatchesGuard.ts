import * as express from 'express'
import Claim from 'app/claims/models/claim'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import { ErrorPaths } from 'first-contact/paths'

const logger = require('@hmcts/nodejs-logging').getLogger('first-contact/guards/claimReferenceMatchesGuard')

export default class ClaimReferenceMatchesGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const reference = req.query.ref

      const claim: Claim = await ClaimStoreClient.retrieveByLetterHolderId(Number(res.locals.user.id))
      res.locals.user.claim = claim

      if (claim.claimNumber !== reference) {
        logger.error('Claim reference mismatch - redirecting to access denied page')
        res.redirect(ErrorPaths.claimSummaryAccessDeniedPage.uri)
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  }

}
