import * as express from 'express'

import { Paths } from 'paid-in-full/paths'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.datePaidPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.render(Paths.datePaidPage.associatedView, { paths: Paths })
    })
  )
