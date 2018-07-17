import * as moment from 'moment'

import { InterestDateType } from 'common/interestDateType'
import { MomentFactory } from 'shared/momentFactory'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { Claim } from 'claims/models/claim'
import { InterestData } from 'common/interestData'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { DraftClaim } from 'drafts/models/draftClaim'
import { isAfter4pm } from 'shared/dateUtils'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import { YesNoOption } from 'models/yesNoOption'
import { InterestTypeOption } from 'claim/form/models/interestType'
import { calculateInterest } from 'common/calculate-interest/calculateInterest'

export async function getInterestDetails (claim: Claim): Promise<InterestData> {
  if (claim.claimData.interest.type === ClaimInterestType.NO_INTEREST || claim.claimData.interest.type === undefined) {
    return undefined
  }

  const interestFromDate: moment.Moment = getInterestDateOrIssueDate(claim)
  const interestToDate: moment.Moment = moment.max(MomentFactory.currentDate(), claim.issuedOn)
  const numberOfDays: number = interestToDate.diff(interestFromDate, 'days')

  const rate = claim.claimData.interest.rate
  let interest: number = claim.totalInterest

  const specificDailyAmount = claim.claimData.interest.specificDailyAmount
  return { interestFromDate, interestToDate, numberOfDays, interest, rate, specificDailyAmount }
}

function getInterestDateOrIssueDate (claim: Claim): moment.Moment {
  if (claim.claimData.interest.interestDate.type === InterestDateType.CUSTOM) {
    return claim.claimData.interest.interestDate.date
  } else {
    return claim.issuedOn
  }
}

export async function draftInterestAmount (claimDraft: DraftClaim): Promise<number> {
  if (claimDraft.interest.option === YesNoOption.NO) {
    return 0.00
  }

  if (claimDraft.interestType.option === InterestTypeOption.BREAKDOWN) {
    return claimDraft.interestTotal.amount
  }
  const interest: number = getInterestRate(claimDraft)
  const breakdown: ClaimAmountBreakdown = claimDraft.amount
  const issuedDate: moment.Moment = isAfter4pm() ? MomentFactory.currentDate().add(1, 'day') : MomentFactory.currentDate()
  const interestStartDate: moment.Moment = claimDraft.interestDate.type === InterestDateType.SUBMISSION ? issuedDate :
    claimDraft.interestStartDate.date.toMoment()
  const claimAmount: number = breakdown.totalAmount()

  return calculateInterest(
    claimAmount,
    interest,
    interestStartDate
  )
}

export async function draftClaimAmountWithInterest (claimDraft: DraftClaim): Promise<number> {
  const interest: number = await draftInterestAmount(claimDraft)
  const claimAmount: number = claimDraft.amount.totalAmount()

  return claimAmount + interest
}

function getInterestRate (claimDraft: DraftClaim): number {
  if (claimDraft.interest.option === YesNoOption.NO) {
    return 0.00
  }

  if (claimDraft.interestRate.type === InterestRateOption.STANDARD) {
    return getStandardInterestRate()
  } else {
    return claimDraft.interestRate.rate
  }
}

export function getStandardInterestRate (): number {
  return 8.0
}
