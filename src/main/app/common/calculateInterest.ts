import { Interest, InterestType } from 'claim/form/models/interest'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'

const STANDARD_RATE = 8.0

function calculateRate (interest: Interest): number {
  if (interest.type === InterestType.NO_INTEREST) {
    return 0.00
  }

  if (interest.type === InterestType.STANDARD) {
    return STANDARD_RATE
  } else {
    return interest.rate
  }
}

export function calculateInterest (amount: number, interest: Interest, interestFromDate: Moment, interestToDate: Moment = MomentFactory.currentDateTime()) {
  const rate = calculateRate(interest)
  const noOfDays = interestToDate.diff(interestFromDate, 'days')

  return parseFloat(((amount * noOfDays * rate) / (365 * 100)).toFixed(2))
}
