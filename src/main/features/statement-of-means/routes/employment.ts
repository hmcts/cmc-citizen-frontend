import * as express from 'express'
import { Paths } from 'statement-of-means/paths'
import { ErrorHandling } from 'common/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.employmentPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.render(Paths.employmentPage.associatedView, {})
    }))
