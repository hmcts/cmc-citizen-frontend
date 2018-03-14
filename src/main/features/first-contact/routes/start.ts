import * as express from 'express'
import { Paths } from 'first-contact/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.startPage.associatedView)
  })
  .post(Paths.startPage.uri, (req: express.Request, res: express.Response): void => {
    res.redirect(Paths.claimReferencePage.uri)
  })
