import { ClaimAmountExceedsLimitError } from 'errors'

export class ClaimValidator {
  static readonly AMOUNT_LIMIT = 10000

  public static claimAmount (claimAmount: number) {
    if (claimAmount == null || claimAmount < 0) {
      throw new Error('Claim amount must be a valid numeric value')
    } else if (claimAmount > this.AMOUNT_LIMIT) {
      throw new ClaimAmountExceedsLimitError()
    }
  }
}
