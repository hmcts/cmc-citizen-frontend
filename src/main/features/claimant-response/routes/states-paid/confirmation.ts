import * as express from 'express'

import { StatesPaidPaths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      // TODO: get claimant response data from claim once in claim-store
      const scenario = req.query.scenario
      let accepted: boolean = true
      let mediationRequested: boolean = true

      if (scenario === '1') {
        accepted = true
        mediationRequested = false
      } else if (scenario === '2') {
        accepted = false
        mediationRequested = true
      } else if (scenario === '3') {
        accepted = false
        mediationRequested = false
      }

      res.render(
        StatesPaidPaths.confirmationPage.associatedView,
        {
          claim: claim,
          accepted: accepted,
          mediationRequested: mediationRequested,
          confirmationDate: MomentFactory.currentDate()
        })
    }))
