import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'

function renderView (res: express.Response): void {

  res.render(Paths.hearingLocationPage.associatedView)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingLocationPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
