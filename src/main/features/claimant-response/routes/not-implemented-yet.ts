import * as express from 'express'
import { Paths } from 'claimant-response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.notImplementedYetPage.uri, (req: express.Request, res: express.Response) => {
    res.render('not-implemented-yet')
  })
