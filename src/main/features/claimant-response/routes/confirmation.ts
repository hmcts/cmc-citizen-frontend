import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { getRepaymentPlanOrigin } from 'claimant-response/helpers/settlementHelper'
import { MomentFactory } from 'shared/momentFactory'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim

      res.render(
        Paths.confirmationPage.associatedView,
        {
          claim: claim,
          confirmationDate: MomentFactory.currentDate(),
          repaymentPlanOrigin: getRepaymentPlanOrigin(claim.settlement)
        })
    }))
