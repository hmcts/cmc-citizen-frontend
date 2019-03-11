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
  // .post(
  //   Paths.hearingLocationPage.uri,
  //   ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
  //     const claim: Claim = res.locals.claim
  //
  //     res.redirect(Paths.howMediationWorksPage.evaluateUri({ externalId: claim.externalId }))
  //   })
  // )
