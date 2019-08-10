import * as express from 'express'
import { Paths } from 'orders/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      res.render(Paths.confirmationPage.associatedView, {
        otherParty: 'Jan Clark',
        deadline: MomentFactory.currentDate().add(12, 'days')
      })
    }))
