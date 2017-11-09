import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    const claim: Claim = res.locals.user.claim
    res.render(Paths.startPage.associatedView, {
      claimantName: claim.claimData.claimant.name,
      nextPageLink: Paths.whatYouNeedPage.uri
    })
  })
