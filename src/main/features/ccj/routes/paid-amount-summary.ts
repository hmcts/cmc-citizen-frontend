import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { InterestType } from 'forms/models/interest'
import InterestDateType from 'app/common/interestDateType'
import { Moment } from 'moment'

const nextPageUrl: string = 'todo'

function calculateInterest (amount: number, noOfDays: number) {
  const rate = 8.0
  return parseFloat(((amount * noOfDays * rate) / (365 * 100) ).toFixed(2))
}

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

  return {
    numberOfDays: noOfDays,
    interest: calculateInterest(claim.claimData.amount, noOfDays),
    interestDate: interestDate,
    defaultJudgmentDate: todayDate
  }
}

export default express.Router()
  .get(Paths.paidAmountSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.user.claim

      res.render(
        Paths.paidAmountSummaryPage.associatedView,
        { claim: claim, interestDetails: getInterestDetails(claim), nextPageUrl: nextPageUrl }
      )
    }))
