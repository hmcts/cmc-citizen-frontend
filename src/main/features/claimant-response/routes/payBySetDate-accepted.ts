import * as express from 'express'

import { Paths } from 'claimant-response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.payBySetDateAcceptedPage.uri,
    async (req: express.Request, res: express.Response) => {
      res.render(Paths.payBySetDateAcceptedPage.associatedView)
    })
  .post(
    Paths.payBySetDateAcceptedPage.uri,
    async (req: express.Request, res: express.Response) => {
      const { externalId } = await req.params

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
