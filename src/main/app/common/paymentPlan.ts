import * as moment from 'moment'
import 'moment-precise-range-plugin'

export class PaymentPlan {
  private numberOfInstalments: number

  constructor (
    totalAmount: number,
    instalmentAmount: number,
    private frequencyInWeeks: number) {
    this.numberOfInstalments = totalAmount / instalmentAmount
  }

  getPaymentLength (): string {
    const now = moment()
    const lastPaymentDate = this.getLastPaymentDate(now)

    const paymentDuration = (moment as any).preciseDiff(now, lastPaymentDate, true)
    const { years, months, days } = paymentDuration
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

  getLastPaymentDate (fromDate: moment.Moment = moment()): moment.Moment {
    const timeToCompletePaymentsInWeeks = this.numberOfInstalments * this.frequencyInWeeks
    const lastPaymentDate = fromDate.clone().add(timeToCompletePaymentsInWeeks, 'weeks')
    return lastPaymentDate
  }

  private pluralize (num: number, word: string) {
    const plural = num < 2 ? '' : 's'
    return `${num} ${word}${plural}`
  }
}
