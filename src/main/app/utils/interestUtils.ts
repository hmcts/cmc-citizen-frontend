import { InterestDateType } from 'app/common/interestDateType'
import { calculateInterest } from 'app/common/calculateInterest'
import { MomentFactory } from 'common/momentFactory'
import { ClaimAmountBreakdown } from 'features/claim/form/models/claimAmountBreakdown'
import DraftClaim from 'app/drafts/models/draftClaim'

export function interestAmount (claimDraft: DraftClaim): number {
  const interestRate = claimDraft.interest
  const breakdown: ClaimAmountBreakdown = claimDraft.amount
  const interestDate = claimDraft.interestDate
  const claimAmount: number = breakdown.totalAmount()

  return calculateInterest(
    claimAmount,
    interestRate,
    interestDate.type === InterestDateType.CUSTOM ? interestDate.date.toMoment() : MomentFactory.currentDate()
  )
}

export function claimAmountWithInterest (claimDraft: DraftClaim): number {
  const interest = interestAmount(claimDraft)
  const claimAmount: number = claimDraft.amount.totalAmount()

  return claimAmount + interest
}
