import * as express from 'express'

import { Paths } from 'paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.resolveBeforeClaimPage.uri, function (req, res) {
    res.render(Paths.resolveBeforeClaimPage.associatedView)
  })
