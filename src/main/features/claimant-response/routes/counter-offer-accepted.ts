import * as express from 'express'

import { Paths } from 'claimant-response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferApprovedPage.uri, (req: express.Request, res: express.Response) => {
      res.render(Paths.counterOfferApprovedPage.associatedView)
    })
  .post(
    Paths.counterOfferApprovedPage.uri, (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
