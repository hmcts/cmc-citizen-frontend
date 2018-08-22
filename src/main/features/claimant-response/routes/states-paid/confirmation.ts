import * as express from 'express'

import { StatesPaidPaths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { ClaimantResponse } from 'claims/models/claimantResponse'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: ClaimantResponse = claim.claimantResponse
      let accepted: boolean = true
      let mediationRequested: boolean = false

      if (response.type === ClaimantResponseType.REJECTION) {
        accepted = false
        mediationRequested = (response as ResponseRejection).freeMediation
      } else {
        accepted = true
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
