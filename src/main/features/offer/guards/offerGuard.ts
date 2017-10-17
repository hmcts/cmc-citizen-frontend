import * as express from 'express'
import Claim from 'claims/models/claim'
import { Paths } from 'response/paths'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import User from 'idam/user'

const logger = require('@hmcts/nodejs-logging').getLogger('response/guards/offerGuard')
const eligibleForOffer = toBoolean(config.get<boolean>('featureToggles.offer'))
export class OfferGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.user.claim
    if (!eligibleForOffer) {
      logger.warn(`Claim ${claim.claimNumber} not eligible for a offer - redirecting confirmation page`)
      const user: User = res.locals.user
      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: user.claim.externalId }))
    } else {
      next()
    }
  }
}
