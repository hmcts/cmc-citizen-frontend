import * as moment from 'moment'

import { InterestDateType } from 'app/common/interestDateType'
import { MomentFactory } from 'common/momentFactory'
import { InterestType } from 'claim/form/models/interest'
import { calculateInterest } from 'app/common/calculateInterest'
import { Claim } from 'claims/models/claim'
import { InterestData } from 'app/common/interestData'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { DraftClaim } from 'drafts/models/draftClaim'

export async function getInterestDetails (claim: Claim): Promise<InterestData> {
  if (claim.claimData.interest.type === InterestType.NO_INTEREST) {
    return undefined
  }

  const interestFromDate: moment.Moment = getInterestDateOrIssueDate(claim)
  const interestToDate: moment.Moment = moment.max(interestFromDate, MomentFactory.currentDate())
  const numberOfDays: number = interestToDate.diff(interestFromDate, 'days')

  const interest: number = await calculateInterest(claim.claimData.amount.totalAmount(), claim.claimData.interest, interestFromDate, interestToDate)
  const rate = claim.claimData.interest.rate

  return { interestFromDate, interestToDate, numberOfDays, interest, rate }
}

function getInterestDateOrIssueDate (claim: Claim): moment.Moment {
  if (claim.claimData.interestDate.type === InterestDateType.CUSTOM) {
    return claim.claimData.interestDate.date
  } else {
    return claim.issuedOn
  }
}

export async function draftInterestAmount (claimDraft: DraftClaim): Promise<number> {
  const interest = claimDraft.interest
  const breakdown: ClaimAmountBreakdown = claimDraft.amount
  const interestDate = claimDraft.interestDate
  const claimAmount: number = breakdown.totalAmount()

  return calculateInterest(
    claimAmount,
    interest,
    interestDate.type === InterestDateType.CUSTOM ? interestDate.date.toMoment() : MomentFactory.currentDate()
  )
}

export async function draftClaimAmountWithInterest (claimDraft: DraftClaim): Promise<number> {
  const interest: number = await draftInterestAmount(claimDraft)
  const claimAmount: number = claimDraft.amount.totalAmount()

  return claimAmount + interest
}
