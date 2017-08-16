import * as express from 'express'
import { Paths } from 'response/paths'
import User from 'idam/user'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import { DefendantResponse } from 'app/claims/models/defendantResponse'

export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
      const user: User = res.locals.user

      const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(user.id)
      const response: DefendantResponse = await ClaimStoreClient.retrieveResponse(user.id, claim.id)

      res.render(Paths.confirmationPage.associatedView, {
        claim: claim,
        submittedOn: response.respondedAt,
        defendantEmail: user.email
      })
    } catch (err) {
      next(err)
    }
  })
