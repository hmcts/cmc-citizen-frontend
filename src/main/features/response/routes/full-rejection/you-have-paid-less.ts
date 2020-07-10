import * as express from 'express'
import { FullRejectionPaths, Paths } from 'response/paths'
import { FullRejectionGuard } from 'response/guards/fullRejectionGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(FullRejectionPaths.youHavePaidLessPage.uri,
    FullRejectionGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      res.render(FullRejectionPaths.youHavePaidLessPage.associatedView)
    })
  .post(FullRejectionPaths.youHavePaidLessPage.uri,
    FullRejectionGuard.requestHandler(),
    function (req: express.Request, res: express.Response) {
      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
