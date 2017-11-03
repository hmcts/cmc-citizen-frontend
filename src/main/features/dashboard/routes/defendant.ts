import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Paths as OfferPaths } from 'offer/paths'
import { ErrorHandling } from 'common/errorHandling'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'

export default express.Router()
  .get(Paths.defendantPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params
    const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user.id)

    res.render(Paths.defendantPage.associatedView, {
      claim: claim,
      claimReceiptUri: Paths.claimReceiptReceiver.evaluateUri({ externalId: externalId }),
      responseReceiptUri: Paths.responseReceiptReceiver.evaluateUri({ externalId: externalId }),
      offerPageUri: OfferPaths.offerPage.evaluateUri({ externalId: externalId })
    })
  }))
