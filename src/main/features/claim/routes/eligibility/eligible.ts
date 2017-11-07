import * as express from 'express'

import { Paths } from 'claim/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityEligiblePage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.eligibilityEligiblePage.associatedView, { nextPage: Paths.taskListPage.uri })
  })
