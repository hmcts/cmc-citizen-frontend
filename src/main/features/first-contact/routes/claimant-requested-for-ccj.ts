import * as express from 'express'

import { ErrorPaths } from 'first-contact/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(ErrorPaths.ccjRequestedHandoffPage.uri, (req: express.Request, res: express.Response) => {
    res.render(ErrorPaths.ccjRequestedHandoffPage.associatedView)
  })
