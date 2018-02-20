import { InterestDateType } from 'app/common/interestDateType'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'
import { InterestType } from 'claim/form/models/interest'
import { calculateInterest } from 'app/common/calculateInterest'
import { Claim } from 'claims/models/claim'

export async function getInterestDetails (claim: Claim): Promise<object> {
  if (claim.claimData.interest.type === InterestType.NO_INTEREST) {
    return undefined
  }

  let interestDate: Moment

  if (claim.claimData.interestDate.type === InterestDateType.CUSTOM) {
    interestDate = claim.claimData.interestDate.date
  } else {
    interestDate = claim.createdAt.startOf('day')
  }

  const todayDate: Moment = MomentFactory.currentDate().startOf('day')
  const noOfDays: number = todayDate.diff(interestDate, 'days')
  const rate: number = claim.claimData.interest.rate

  return {
    numberOfDays: noOfDays,
    interest: await calculateInterest(claim.claimData.amount.totalAmount(), claim.claimData.interest, interestDate),
    rate: rate,
    interestDate: interestDate
  }
}
