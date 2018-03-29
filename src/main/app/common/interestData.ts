import { Moment } from 'moment'

export interface InterestData {
  numberOfDays: number
  interest: number
  rate: number
  interestFromDate: Moment
  interestToDate: Moment
  specificDailyAmount: number
}
