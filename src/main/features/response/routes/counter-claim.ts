import * as express from 'express'

import { Paths } from 'response/paths'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import User from 'app/idam/user'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    const claim: Claim = await ClaimStoreClient.retrieveByDefendantId(user.id)

    res.render(Paths.counterClaimPage.associatedView, {
      claim: claim,
      response: user.responseDraft
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.counterClaimPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(res, next)
  })
