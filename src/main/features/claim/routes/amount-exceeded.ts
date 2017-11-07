import * as express from 'express'

import { ErrorPaths } from 'claim/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(ErrorPaths.amountExceededPage.uri, (req: express.Request, res: express.Response) => {
    res.render(ErrorPaths.amountExceededPage.associatedView)
  })
