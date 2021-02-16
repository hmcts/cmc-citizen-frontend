import * as express from 'express'
import * as HttpStatus from 'http-status-codes'
import * as _ from 'lodash'

import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'

/* tslint:disable:no-default-export */
export default express.Router()
  .get('/', (req, res) => {

    const totalAmount: string = req.query['total-amount']
    const instalmentAmount: string = req.query['instalment-amount']
    const frequencyInWeeks: string = req.query['frequency-in-weeks']

    const error: string = validate(totalAmount, instalmentAmount, frequencyInWeeks)

    if (error) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error
        }
      })
    }

    const frequency: Frequency = Frequency.ofWeekly(Number(frequencyInWeeks))
    const paymentPlan: PaymentPlan = PaymentPlan.create(Number(totalAmount), Number(instalmentAmount), frequency)

    return res.status(HttpStatus.OK).json({
      paymentPlan: {
        paymentLength: paymentPlan.calculatePaymentLength(),
        lastPaymentDate: paymentPlan.calculateLastPaymentDate().toJSON()
      }
    })
  })

function validate (totalAmount: string, instalmentAmount: string, frequencyInWeeks: string) {
  return validateThatIsPositiveNumber(totalAmount, 'total-amount')
  || validateThatIsPositiveNumber(instalmentAmount, 'instalment-amount')
  || validateThatIsPositiveNumber(frequencyInWeeks, 'frequency-in-weeks')
}

function validateThatIsPositiveNumber (value: string, name: string) {
  if (_.isEmpty(value)) {
    return `'${name}' not provided`
  }
  const convertedValue = Number(value)
  if (isNaN(convertedValue)) {
    return `'${name}' must be a number`
  }
  if (convertedValue < 1) {
    return `'${name}' must be a positive number`
  }
}
