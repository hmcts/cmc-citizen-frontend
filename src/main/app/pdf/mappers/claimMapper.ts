import { MomentFormatter } from 'utils/momentFormatter'
import { NumberFormatter } from 'utils/numberFormatter'
import { InterestMapper } from 'app/pdf/mappers/interestMapper'
import Claim from 'claims/models/claim'

export class ClaimMapper {

  static createClaimDetails (claim: Claim): object {
    const data = {
      submittedDate: MomentFormatter.formatLongDateAndTime(claim.createdAt),
      claimNumber: claim.claimNumber,
      amount: NumberFormatter.formatMoney(claim.claimData.amount),
      issueFee: NumberFormatter.formatMoney(claim.claimData.paidFeeAmount),
      totalAmount: NumberFormatter.formatMoney(claim.totalAmount),
      reason: claim.claimData.reason
    }

    if (claim.claimData.interest) {
      data['interest'] = InterestMapper.createInterestData(claim)
    }

    return data
  }
}
