import * as express from 'express'
import { Paths } from 'claim/paths'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      throw Error('CCJ document cannot be downloaded')
    }))
