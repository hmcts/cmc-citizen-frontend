import * as express from 'express'

import { Paths } from 'eligibility/paths'
import { Paths as ClaimPaths } from 'claim/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hwfEligibleReferencePage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.hwfEligibleReferencePage.associatedView, {
      nextPage: ClaimPaths.taskListPage.uri
    })
  })
