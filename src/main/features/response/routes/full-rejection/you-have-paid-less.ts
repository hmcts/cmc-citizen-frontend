import * as express from 'express'
import { FullRejectionPaths, Paths } from 'response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(FullRejectionPaths.youHavePaidLess.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await Promise.resolve(res.render(FullRejectionPaths.youHavePaidLess.associatedView, { claim: res.locals.claim }))
    })
  .post(FullRejectionPaths.youHavePaidLess.uri,
    function (req, res) {
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
    })
