import * as express from 'express'
import { Paths } from 'response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.youHavePaidLess.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await Promise.resolve(res.render(Paths.youHavePaidLess.associatedView, { claim: res.locals.claim }))
    })
  .post(Paths.youHavePaidLess.uri,
    function (req, res) {
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
    })
