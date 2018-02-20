import { Moment } from 'moment'

export class InterestData {
  numberOfDays: number
  interest: number
  rate: number
  interestFromDate: Moment

  constructor (numberOfDays: number, interest: number, rate: number, interestFromDate: Moment) {
    this.numberOfDays = numberOfDays
    this.interest = interest
    this.rate = rate
    this.interestFromDate = interestFromDate
  }
}
