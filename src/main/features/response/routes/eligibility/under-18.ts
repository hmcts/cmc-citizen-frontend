import * as express from 'express'
import { Paths } from 'response/paths'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.under18Page.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => res.render(Paths.under18Page.associatedView)))
