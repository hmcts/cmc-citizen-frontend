import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { InterestType } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'
import { Moment } from 'moment'
import { calculateInterest } from 'app/common/calculateInterest'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

async function getInterestDetails (claim: Claim): Promise<object> {
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
    interest: await calculateInterest(claim.claimData.amount.totalAmount(), claim.claimData.interest, interestDate),
    rate: rate,
    interestDate: interestDate,
    defaultJudgmentDate: todayDate
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.paidAmountSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftCCJ> = res.locals.ccjDraft
      const { externalId } = req.params

      res.render(
        Paths.paidAmountSummaryPage.associatedView, {
          claim: claim,
          alreadyPaid: draft.document.paidAmount.amount || 0,
          interestDetails: await getInterestDetails(claim),
          nextPageUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
        }
      )
    }))
