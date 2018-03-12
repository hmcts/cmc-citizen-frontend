import * as express from 'express'
import { ErrorHandling } from 'common/errorHandling'
import { Paths } from 'app/paths'
/* tslint:disable:no-default-export */

export default express.Router()
  .get(Paths.enterClaimNumberPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      res.render('not-implemented-yet')
    })
  )
  .post(Paths.enterClaimNumberPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      res.render('not-implemented-yet')
    })
  )
