import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.howFreeMediationWorksPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    res.render(Paths.howFreeMediationWorksPage.associatedView)
  }))
