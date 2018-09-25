import * as moment from 'moment'
import 'moment-precise-range-plugin'
import { MomentFactory } from 'shared/momentFactory'

import { Frequency } from 'common/frequency/frequency'
import { FrequencyConversions } from 'common/frequency/frequencyConversions'

export class PaymentPlan {
  private numberOfInstalments: number

  constructor (
    public totalAmount: number,
    public instalmentAmount: number,
    public frequency: Frequency,
    public startDate: moment.Moment) {
    this.numberOfInstalments = Math.ceil(totalAmount / instalmentAmount)
  }

  static create (
    totalAmount: number,
    instalmentAmount: number,
    frequency: Frequency,
    startDate: moment.Moment = MomentFactory.currentDate()): PaymentPlan {
    return new PaymentPlan(totalAmount, instalmentAmount, frequency, startDate)
  }

  calculatePaymentLength (): string {
    const lastPaymentDate: moment.Moment = this.calculateLastPaymentDate()

    const { years, months, days } = (moment as any).preciseDiff(this.startDate, lastPaymentDate, true)
    const paymentLength: Array<string> = []

    if (years) {
      paymentLength.push(this.pluralize(years, 'year'))
    }

    if (this.frequency === Frequency.MONTHLY) {
      if (days) {
        paymentLength.push(this.pluralize(months + 1, 'month'))
      } else {
        paymentLength.push(this.pluralize(months, 'month'))
      }
      return paymentLength.join(' ')
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

  calculateLastPaymentDate (): moment.Moment {
    const timeToCompletePaymentsInWeeks: number = this.numberOfInstalments * this.frequency.inWeeks
    return this.startDate.clone().add(timeToCompletePaymentsInWeeks, 'weeks')
  }

  convertTo (frequency: Frequency): PaymentPlan {
    let monthlyInstalmentAmount
    switch (frequency) {
      case Frequency.WEEKLY:
        monthlyInstalmentAmount = FrequencyConversions.convertAmountToWeekly(this.instalmentAmount, this.frequency)
        break
      case Frequency.TWO_WEEKLY:
        monthlyInstalmentAmount = FrequencyConversions.convertAmountToTwoWeekly(this.instalmentAmount, this.frequency)
        break
      case Frequency.FOUR_WEEKLY:
        monthlyInstalmentAmount = FrequencyConversions.convertAmountToFourWeekly(this.instalmentAmount, this.frequency)
        break
      case Frequency.MONTHLY:
        monthlyInstalmentAmount = FrequencyConversions.convertAmountToMonthly(this.instalmentAmount, this.frequency)
        break
      default:
        throw new Error(`Incompatible Frequency: ${frequency}`)
    }

    return PaymentPlan.create(this.totalAmount, monthlyInstalmentAmount, frequency, this.startDate)
  }

  private pluralize (num: number, word: string) {
    const plural: string = num < 2 ? '' : 's'
    return `${num} ${word}${plural}`
  }
}
