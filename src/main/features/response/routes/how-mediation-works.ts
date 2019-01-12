import * as express from 'express'

import { Paths } from 'response/paths'
import { ErrorHandling } from 'shared/errorHandling'

function renderView (res: express.Response): void {
  res.render(Paths.howMediationWorksPage.associatedView)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.howMediationWorksPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.howMediationWorksPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
