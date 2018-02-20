import { InterestDateType } from 'app/common/interestDateType'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'
import { InterestType } from 'claim/form/models/interest'
import { calculateInterest } from 'app/common/calculateInterest'
import { Claim } from 'claims/models/claim'
import { InterestData } from 'app/common/InterestData'

export async function getInterestDetails (claim: Claim): Promise<InterestData> {
  if (claim.claimData.interest.type === InterestType.NO_INTEREST) {
    return undefined
  }

  let interestDate: Moment

  if (claim.claimData.interestDate.type === InterestDateType.CUSTOM) {
    interestDate = claim.claimData.interestDate.date
  } else {
    interestDate = claim.issuedOn.startOf('day')
  }

  const todayDate: Moment = MomentFactory.currentDate().startOf('day')
  const noOfDays: number = todayDate.diff(interestDate, 'days') < 0 ? 0 : todayDate.diff(interestDate, 'days')
  const interest: number = noOfDays > 0 ? await calculateInterest(claim.claimData.amount.totalAmount(), claim.claimData.interest, interestDate) : 0
  const rate: number = claim.claimData.interest.rate

  return new InterestData(noOfDays, interest, rate, interestDate)
}
