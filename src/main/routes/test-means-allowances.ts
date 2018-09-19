import * as express from 'express'

import { Paths } from 'paths'
import * as config from 'config'

/* A TEMPORARY PAGE TO TEST AZURE VAULT INTEGRATION */

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.testMeansAllowances.uri, function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(config.get('meansAllowances'))
  })
