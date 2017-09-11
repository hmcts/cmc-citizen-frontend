import { MomentFormatter } from 'utils/momentFormatter'
import { NumberFormatter } from 'utils/numberFormatter'
import ClaimData from 'claims/models/claimData'
import { calculateInterest } from 'app/common/calculateInterest'
import { InterestType } from 'app/forms/models/interest'
import Claim from 'app/claims/models/claim'
import InterestDateType from 'app/common/interestDateType'
import { Moment } from 'moment'

export class InterestMapper {

  public static createInterestData (claim: Claim): object {
    const claimData: ClaimData = claim.claimData
    const isNoInterest: boolean = claimData.interest.type === InterestType.NO_INTEREST
    if (isNoInterest) {
      return undefined
    } {
      const interestDate = claimData.interestDate.type === InterestDateType.SUBMISSION ? claim.createdAt : claimData.interestDate.date
      return {
        rate: claimData.interest.rate,
        dateClaimedFrom: MomentFormatter.formatLongDate(interestDate),
        claimedAtDateOfSubmission: NumberFormatter.formatMoney(InterestMapper.calculateInterest(claimData, interestDate)),
        accruedInterest: NumberFormatter.formatMoney(InterestMapper.calculateDailyAmount(claimData))
      }
    }
  }

  public static calculateInterest (claimData: ClaimData, interestDate: Moment): number {
    return calculateInterest(claimData.amount.totalAmount(), claimData.interest, interestDate)
  }

  private static calculateDailyAmount (claimData: ClaimData): number {
    return claimData.amount.totalAmount() / claimData.interest.rate / 365
  }
}
