import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      throw Error('CCJ document cannot be downloaded')
    }))
