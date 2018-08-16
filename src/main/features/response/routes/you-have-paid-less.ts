import * as express from 'express'
import { Paths } from 'response/paths'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.youHavePaidLess.associatedView, { claim: res.locals.claim })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.youHavePaidLess.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(res, next)
    })
  .post(Paths.youHavePaidLess.uri,
    function (req, res) {
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
    })
