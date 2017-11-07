import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { InterestType } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'
import { Moment } from 'moment'
import { calculateInterest } from 'app/common/calculateInterest'

function getInterestDetails (claim: Claim): object {
  if (claim.claimData.interest.type === InterestType.NO_INTEREST) {
    return undefined
  }

  let interestDate: Moment

  if (claim.claimData.interestDate.type === InterestDateType.CUSTOM) {
    interestDate = claim.claimData.interestDate.date
  } else {
    interestDate = claim.createdAt
  }

  const todayDate: Moment = MomentFactory.currentDate()
  const noOfDays: number = todayDate.diff(interestDate, 'days')
  const rate: number = claim.claimData.interest.rate

  return {
    numberOfDays: noOfDays,
    interest: calculateInterest(claim.claimData.amount.totalAmount(), claim.claimData.interest, interestDate),
    rate: rate,
    interestDate: interestDate,
    defaultJudgmentDate: todayDate
  }
}

export default express.Router()
  .get(Paths.paidAmountSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.user.claim
      const alreadyPaid: number = res.locals.user.ccjDraft.document.paidAmount.amount || 0
      const { externalId } = req.params

      res.render(
        Paths.paidAmountSummaryPage.associatedView, {
          claim: claim,
          alreadyPaid: alreadyPaid,
          interestDetails: getInterestDetails(claim),
          nextPageUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
        }
      )
    }))
