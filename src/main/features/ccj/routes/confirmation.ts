import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'
import { Moment } from 'moment'

export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const claim: Claim = res.locals.user.claim
      const ccj = claim.countyCourtJudgment // this will be a proper model soon
      let judgmentDeadline: Moment = claim.countyCourtJudgmentRequestedAt.add(28, 'days')

      if (ccj['payBySetDate']) {
        judgmentDeadline = ccj['payBySetDate'] as Moment
      }

      if (ccj['repaymentPlan']) {
        judgmentDeadline = ccj['repaymentPlan']['firstPaymentDate'] as Moment
      }

      res.render(Paths.confirmationPage.associatedView,
        {
          defendantName: claim.countyCourtJudgment['defendant'].name,
          judgmentDeadline: judgmentDeadline,
          judgmentDownloadPath: Paths.downloadJudgmentReceiver
        })
    }))
