import * as express from 'express'

import { Paths } from 'eligibility/paths'
import { JwtExtractor } from 'idam/jwtExtractor'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.startPage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.startPage.associatedView, {
      registeredUser: JwtExtractor.extract(req) !== undefined
    })
  })
