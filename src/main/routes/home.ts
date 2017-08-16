import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'

export default express.Router()
  .get(AppPaths.homePage.uri, function (req, res) {
    res.redirect(AppPaths.receiver.uri)
  })
