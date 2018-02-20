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

  let interestFromDate: Moment

  if (claim.claimData.interestDate.type === InterestDateType.CUSTOM) {
    interestFromDate = claim.claimData.interestDate.date
  } else {
    interestFromDate = claim.issuedOn
  }

  const todayDate: Moment = MomentFactory.currentDate()
  const numberOfDays: number = todayDate.diff(interestFromDate, 'days') < 0 ? 0 : todayDate.diff(interestFromDate, 'days')
  const interest: number = numberOfDays > 0 ? await calculateInterest(claim.claimData.amount.totalAmount(), claim.claimData.interest, interestFromDate) : 0
  const rate: number = claim.claimData.interest.rate
  const interestToDate: Moment = MomentFactory.currentDate().diff(interestFromDate, 'days') < 0 ? interestFromDate : MomentFactory.currentDate()

  return { numberOfDays, interest, rate, interestFromDate, interestToDate }
}
