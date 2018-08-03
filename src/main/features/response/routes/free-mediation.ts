import * as express from 'express'

import { AbstractFreeMediationPage } from 'shared/components/free-mediation/free-mediation'

import { responsePath, Paths } from 'features/response/paths'

class FreeMediationPage extends AbstractFreeMediationPage {
  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new FreeMediationPage()
  .buildRouter(responsePath)
