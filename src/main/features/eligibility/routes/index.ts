import * as express from 'express'

import { Paths } from 'eligibility/paths'
import { AuthTokenExtractor } from 'idam/authTokenExtractor'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.startPage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.startPage.associatedView, {
      registeredUser: AuthTokenExtractor.extract(req) !== undefined
    })
  })
