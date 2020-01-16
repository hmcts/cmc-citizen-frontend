import * as express from 'express'

import { Paths as AppPaths } from 'paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.waf403Page.uri,
    (req: express.Request, res: express.Response) => {
      res.render('waf')
    })
