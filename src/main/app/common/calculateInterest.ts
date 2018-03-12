import { InterestRate, InterestRateOption } from 'claim/form/models/interestRate'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'
import { InterestRateClient } from 'claims/interestRateClient'

const STANDARD_RATE = 8.0

function getRate (interest: InterestRate): number {
  if (interest.type === InterestRateOption.NO_INTEREST) {
    return 0.00
  }

  if (interest.type === InterestRateOption.STANDARD) {
    return STANDARD_RATE
  } else {
    return interest.rate
  }
}

export async function calculateInterest (amount: number,
                                         interest: InterestRate,
                                         interestFromDate: Moment,
                                         interestToDate: Moment = MomentFactory.currentDateTime()): Promise<number> {
  if (interestToDate.diff(interestFromDate, 'days') > 0) {
    return InterestRateClient.calculateInterestRate(amount, getRate(interest), interestFromDate, interestToDate)
  }
  return 0
}
