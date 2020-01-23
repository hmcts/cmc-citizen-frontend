import * as moment from 'moment'
import 'moment-precise-range-plugin'
import { MomentFactory } from 'shared/momentFactory'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'

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
    let lastPaymentDate = this.startDate.clone()

    switch (this.frequency) {
      case (Frequency.WEEKLY):
        lastPaymentDate.add(this.numberOfInstalments - 1, 'weeks')
        break
      case (Frequency.TWO_WEEKLY):
        lastPaymentDate.add((this.numberOfInstalments - 1) * 2, 'weeks')
        break
      case (Frequency.MONTHLY):
        lastPaymentDate = calculateMonthIncrement(lastPaymentDate, this.numberOfInstalments - 1)
        break
    }
    return lastPaymentDate
  }

  convertTo (frequency: Frequency, startDate?: moment.Moment): PaymentPlan {
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
    const paymentPlanStartDate = startDate ? startDate : this.startDate
    return PaymentPlan.create(this.totalAmount, monthlyInstalmentAmount, frequency, paymentPlanStartDate)
  }

  private pluralize (num: number, word: string) {
    const plural: string = num < 2 ? '' : 's'
    return `${num} ${word}${plural}`
  }
}
