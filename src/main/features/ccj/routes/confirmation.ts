import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'
import { Moment } from 'moment'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { CountyCourtJudgmentPaidFullBySetDate } from 'claims/models/ccj/countyCourtJudgmentPaidFullBySetDate'
import { CountyCourtJudgmentPaidByInstalments } from 'claims/models/ccj/countyCourtJudgmentPaidByInstalments'

export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const claim: Claim = res.locals.user.claim
      const ccj: CountyCourtJudgment = claim.countyCourtJudgment
      let judgmentDeadline: Moment = claim.countyCourtJudgmentRequestedAt.add(28, 'days')

      if (ccj instanceof CountyCourtJudgmentPaidFullBySetDate) {
        judgmentDeadline = (ccj as CountyCourtJudgmentPaidFullBySetDate).payBySetDate as Moment
      }

      if (ccj instanceof CountyCourtJudgmentPaidByInstalments) {
        judgmentDeadline = (ccj as CountyCourtJudgmentPaidByInstalments).repaymentPlan.firstPaymentDate as Moment
      }

      res.render(Paths.confirmationPage.associatedView,
        {
          defendantName: ccj.defendant.name,
          judgmentDeadline: judgmentDeadline,
          judgmentDownloadPath: Paths.downloadJudgmentReceiver
        })
    }))
