import { Frequency } from 'common/frequency/frequency'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

export namespace FrequencyViewFilter {
  export function render (frequency: Frequency): string {
    return frequency.displayValue
  }

  export function renderPaymentFrequency (paymentFrequency: PaymentFrequency): string {
    return Frequency.of(paymentFrequency.toString()).displayValue
  }
}
