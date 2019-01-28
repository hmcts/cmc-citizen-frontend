import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'

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
      res.redirect(Paths.freeMediationPage.evaluateUri({ externalId: externalId }))
    }))
