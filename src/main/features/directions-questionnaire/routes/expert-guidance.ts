import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.expertGuidancePage.uri,
    (req: express.Request, res: express.Response) => res.render(Paths.expertGuidancePage.associatedView))
