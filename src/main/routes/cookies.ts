import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.cookiesPage.uri, function (req, res) {
    res.render(AppPaths.cookiesPage.associatedView)
  })
