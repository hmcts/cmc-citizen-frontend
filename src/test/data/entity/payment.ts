import { Payment } from 'payment-hub-client/payment'

export function paymentOf (amountInPounds: number): Payment {
  const payment = new Payment()
  payment.amount = amountInPounds * 100
  return payment
}
