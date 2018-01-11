import { Interest, InterestType } from 'claim/form/models/interest'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'
import { InterestRateClient } from 'claims/interestRateClient'
import { InterestAmount } from 'claims/models/interestAmount'

const STANDARD_RATE = 8.0

function getRate (interest: Interest): number {
  if (interest.type === InterestType.NO_INTEREST) {
    return 0.00
  }

  if (interest.type === InterestType.STANDARD) {
    return STANDARD_RATE
  } else {
    return interest.rate
  }
}

export async function calculateInterest (amount: number,
                                         interest: Interest,
                                         interestFromDate: Moment,
                                         interestToDate: Moment = MomentFactory.currentDateTime()) {
  const result: InterestAmount = await InterestRateClient.calculateInterestRate(
    amount, getRate(interest), interestFromDate, interestToDate
  )

  return result.amount
}
