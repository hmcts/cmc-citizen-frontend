import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'
import { Moment } from 'moment'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'

export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const claim: Claim = res.locals.user.claim
      const ccj: CountyCourtJudgment = claim.countyCourtJudgment
      const judgmentDeadline: Moment = ccj.payBySetDate
        || (ccj.repaymentPlan && ccj.repaymentPlan.firstPaymentDate)
        || claim.countyCourtJudgmentRequestedAt.add(28, 'days')

      res.render(Paths.confirmationPage.associatedView,
        {
          defendantName: ccj.defendant.name,
          judgmentDeadline: judgmentDeadline
        })
    }))
