import * as express from 'express'
import * as toBoolean from 'to-boolean'
import * as config from 'config'
import { Claim } from 'app/claims/models/claim'
import { ClaimStoreClient } from 'app/claims/claimStoreClient'
import { ErrorPaths } from 'first-contact/paths'
import { AuthenticationRedirectFactory } from 'utils/AuthenticationRedirectFactory'
import { User } from 'idam/user'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('first-contact/guards/claimReferenceMatchesGuard')

const oauthEnabled = toBoolean(config.get('featureToggles.idamOauth'))

export class ClaimReferenceMatchesGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const reference = ClaimReferenceMatchesGuard.getClaimRef(req)

      const user: User = res.locals.user
      const claim: Claim = await ClaimStoreClient.retrieveByLetterHolderId(user.id)
      res.locals.claim = claim

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

  private static getClaimRef (req: express.Request): string {
    if (oauthEnabled) {
      return AuthenticationRedirectFactory.get().getStateCookie(req)
    }
    return req.query.ref
  }
}
