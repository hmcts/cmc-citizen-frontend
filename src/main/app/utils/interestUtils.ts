import { InterestDateType } from 'app/common/interestDateType'
import { calculateInterest } from 'app/common/calculateInterest'
import { MomentFactory } from 'common/momentFactory'
import { ClaimAmountBreakdown } from 'features/claim/form/models/claimAmountBreakdown'
import { DraftClaim } from 'app/drafts/models/draftClaim'

export async function interestAmount (claimDraft: DraftClaim): Promise<number> {
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

export async function claimAmountWithInterest (claimDraft: DraftClaim): Promise<number> {
  const interest: number = await interestAmount(claimDraft)
  const claimAmount: number = claimDraft.amount.totalAmount()

  return claimAmount + interest
}
