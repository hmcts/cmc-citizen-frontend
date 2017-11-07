import * as express from 'express'

import { Paths } from 'features/response/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { ImpactOfDispute } from 'response/form/models/impactOfDispute'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.impactOfDisputePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.render(Paths.impactOfDisputePage.associatedView, {
        form: new Form(new ImpactOfDispute())
      })
    }))
