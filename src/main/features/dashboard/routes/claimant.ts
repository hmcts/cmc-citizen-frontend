import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'common/errorHandling'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'

export default express.Router()
  .get(Paths.claimantPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params
    const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId)

    res.render(Paths.claimantPage.associatedView, {
      claim: claim,
      receiptUri: Paths.claimReceiptReceiver.uri.replace(':externalId', externalId)
    })
  }))
