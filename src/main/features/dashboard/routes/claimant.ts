import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { ErrorHandling } from 'common/errorHandling'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'

export default express.Router()
  .get(Paths.claimantPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params
    const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user.id)

    res.render(Paths.claimantPage.associatedView, {
      claim: claim,
      receiptUri: Paths.claimReceiptReceiver.evaluateUri({ externalId: externalId })
    })
  }))
  .post(Paths.claimantPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params
    res.redirect(CCJPaths.theirDetailsPage.evaluateUri({ externalId: externalId }))
  }))
