import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { ClaimAmountRow } from 'claim/form/models/claimAmountRow'

export function breakdownOf (amount: number): ClaimAmountBreakdown {
  const breakdown = new ClaimAmountBreakdown()
  breakdown.rows[0] = new ClaimAmountRow('Some reason', amount)
  return breakdown
}
