import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ForbiddenError } from 'errors'
import { Moment } from 'moment'
import { DirectionOrder } from 'claims/models/directionOrder'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

async function getClaimStoreClient (): Promise<ClaimStoreClient> {
  const serviceAuthToken = await new ServiceAuthTokenFactoryImpl().get()
  return new ClaimStoreClient(undefined, serviceAuthToken)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params
      const user: User = res.locals.user
      const claimStoreClient = await getClaimStoreClient()
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      const reconsiderationDeadline: Moment = claim ? await claim.respondToOnlineOconReconsiderationDeadline() : undefined
      const isReviewOrderEligible: boolean = DirectionOrder.isReviewOrderEligible(reconsiderationDeadline)
      const respondToReviewOrderDeadline: Moment = claim ? await claim.respondToReviewOrderDeadline() : undefined
      const judgePilot: boolean = claim ? claim.features !== undefined && claim.features.includes('judgePilotEligible') : false

      if (claim && claim.defendantId !== user.id) {
        throw new ForbiddenError()
      }

      res.render(Paths.defendantPage.associatedView, {
        claim: claim,
        reconsiderationDeadline: reconsiderationDeadline,
        isReviewOrderEligible: isReviewOrderEligible,
        respondToReviewOrderDeadline: respondToReviewOrderDeadline,
        judgePilot: judgePilot
      })
    }))
