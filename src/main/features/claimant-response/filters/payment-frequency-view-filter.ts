import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

export namespace PaymentScheduleViewFilter {
  export function render (value: string): string {
    return PaymentSchedule.of(value).displayValue
  }
}
