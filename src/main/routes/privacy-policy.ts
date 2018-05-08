import * as express from 'express'

import { Paths as AppPaths } from 'paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.privacyPolicyPage.uri,
    (req: express.Request, res: express.Response) => {
      res.render(AppPaths.privacyPolicyPage.associatedView)
    })
