import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ForbiddenError } from 'errors'
import { Moment } from 'moment'
import { DirectionOrder } from 'claims/models/directionOrder'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params
      const user: User = res.locals.user
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      const reconsiderationDeadline: Moment = claim ? await claim.respondToReconsiderationDeadline() : undefined
      const isReviewOrderEligible: boolean = DirectionOrder.isReviewOrderEligible(reconsiderationDeadline)
      const respondToReviewOrderDeadline: Moment = claim ? await claim.respondToReviewOrderDeadline() : undefined

      if (claim && claim.defendantId !== user.id) {
        throw new ForbiddenError()
      }

      res.render(Paths.defendantPage.associatedView, {
        claim: claim,
        reconsiderationDeadline: reconsiderationDeadline,
        isReviewOrderEligible: isReviewOrderEligible,
        respondToReviewOrderDeadline: respondToReviewOrderDeadline
      })
    }))
