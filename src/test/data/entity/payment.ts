import { Payment } from 'app/pay/payment'

export function paymentOf (amountInPounds: number): Payment {
  const payment = new Payment()
  payment.amount = amountInPounds * 100
  return payment
}
