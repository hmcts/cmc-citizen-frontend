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
    const paymentLength: Array<string> = []
    switch (this.frequency) {
      case (Frequency.WEEKLY):
        paymentLength.push(this.pluralize(this.numberOfInstalments, 'week'))
        break
      case (Frequency.TWO_WEEKLY):
        paymentLength.push(this.pluralize(2 * this.numberOfInstalments, 'week'))
        break
      default:
        paymentLength.push(this.pluralize(this.numberOfInstalments, 'month'))
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
