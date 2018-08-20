import * as moment from 'moment'
import 'moment-precise-range-plugin'
import { MomentFactory } from 'shared/momentFactory'

import { Frequency } from 'common/frequency/frequency'

export class PaymentPlan {
  private numberOfInstalments: number

  constructor (
    public readonly totalAmount: number,
    public readonly instalmentAmount: number,
    public readonly frequency: Frequency) {
    this.numberOfInstalments = totalAmount / instalmentAmount
  }

  static create (
    totalAmount: number,
    instalmentAmount: number,
    frequency: Frequency): PaymentPlan {
    return new PaymentPlan(totalAmount, instalmentAmount, frequency)
  }

  getPaymentLength (): string {
    const now: moment.Moment = MomentFactory.currentDate()
    const lastPaymentDate: moment.Moment = this.getLastPaymentDate(now)

    const { years, months, days } = (moment as any).preciseDiff(now, lastPaymentDate, true)
    const paymentLength: Array<string> = []

    if (years) {
      paymentLength.push(this.pluralize(years, 'year'))
    }

    if (months) {
      paymentLength.push(this.pluralize(months, 'month'))
    }

    if (days) {
      const weeks = moment.duration(days, 'day').get('week')

      if (weeks) {
        paymentLength.push(this.pluralize(weeks, 'week'))
      }
    }

    return paymentLength.join(' ')
  }

  private pluralize (num: number, word: string) {
    const plural: string = num < 2 ? '' : 's'
    return `${num} ${word}${plural}`
  }

  getLastPaymentDate (fromDate: moment.Moment = MomentFactory.currentDate()): moment.Moment {
    const timeToCompletePaymentsInWeeks: number = this.numberOfInstalments * this.frequency.inWeeks
    return fromDate.clone().add(timeToCompletePaymentsInWeeks, 'weeks')
  }
}
