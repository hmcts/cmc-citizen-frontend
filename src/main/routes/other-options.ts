import * as express from 'express'

import { Paths } from 'app/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.otherOptionsPage.uri, function (req, res) {
    res.render(Paths.otherOptionsPage.associatedView)
  })
