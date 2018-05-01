import * as express from 'express'

import { Paths } from 'eligibility/paths'
import * as config from 'config'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.mcolEligibilityPage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.mcolEligibilityPage.associatedView, {
      mcolUrl: config.get<string>('mcol.url')
    })
  })
