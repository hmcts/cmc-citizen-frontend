import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimIssuePaths } from 'claim/paths'

export default express.Router()
  .get(AppPaths.homePage.uri, function (req, res) {
    res.redirect(ClaimIssuePaths.startPage.uri)
  })
