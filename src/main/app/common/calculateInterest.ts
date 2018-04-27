import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { InterestRateClient } from 'claims/interestRateClient'

export async function calculateInterest (amount: number,
                                         interestRate: number,
                                         interestFromDate: Moment,
                                         interestToDate: Moment = MomentFactory.currentDateTime()): Promise<number> {
  if (interestToDate.diff(interestFromDate, 'days') > 0) {
    return InterestRateClient.calculateInterestRate(amount, interestRate, interestFromDate, interestToDate)
  }
  return 0
}
