export class PaymentSchedule {
  static readonly EACH_WEEK = new PaymentSchedule('EACH_WEEK')
  static readonly EVERY_TWO_WEEKS = new PaymentSchedule('EVERY_TWO_WEEKS')
  static readonly EVERY_MONTH = new PaymentSchedule('EVERY_MONTH')

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): PaymentSchedule[] {
    return [
      PaymentSchedule.EACH_WEEK,
      PaymentSchedule.EVERY_TWO_WEEKS,
      PaymentSchedule.EVERY_MONTH
    ]
  }
}
