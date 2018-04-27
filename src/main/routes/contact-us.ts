import * as express from 'express'

import { Paths as AppPaths } from 'main/app/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.contactUsPage.uri,
    (req: express.Request, res: express.Response) => {
      res.render(AppPaths.contactUsPage.associatedView)
    })
