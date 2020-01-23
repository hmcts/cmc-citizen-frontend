import { Frequency } from 'common/frequency/frequency'
import { PaymentSchedule as PS } from 'claims/models/response/core/paymentSchedule'

export class PaymentSchedule {
  static readonly EACH_WEEK = new PaymentSchedule('EACH_WEEK', 'Each week')
  static readonly EVERY_TWO_WEEKS = new PaymentSchedule('EVERY_TWO_WEEKS', 'Every two weeks')
  static readonly EVERY_MONTH = new PaymentSchedule('EVERY_MONTH', 'Every month')

  constructor (public readonly value: string, public readonly displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): PaymentSchedule[] {
    return [
      PaymentSchedule.EACH_WEEK,
      PaymentSchedule.EVERY_TWO_WEEKS,
      PaymentSchedule.EVERY_MONTH
    ]
  }

  static of (value: string): PaymentSchedule {
    const result: PaymentSchedule = PaymentSchedule.all().filter(item => item.value === value).pop()

    if (result) {
      return result
    }

    throw new Error(`There is no PaymentSchedule: '${value}'`)
  }

  static toFrequency (value: PS): Frequency {
    switch (value) {
      case 'EACH_WEEK': {
        return Frequency.WEEKLY
      }
      case 'EVERY_TWO_WEEKS': {
        return Frequency.TWO_WEEKLY
      }
      case 'EVERY_MONTH': {
        return Frequency.MONTHLY
      }
    }
  }
}
