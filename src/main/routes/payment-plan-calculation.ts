import * as express from 'express'
import * as HttpStatus from 'http-status-codes'
import * as _ from 'lodash'

import { Paths as AppPaths } from 'paths'
import PaymentPlan from 'common/PaymentPlan'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.paymentPlanCalculation.uri, (req, res) => {

    const totalAmount = req.query['total-amount']
    const instalmentAmount = req.query['instalment-amount']
    const frequencyInWeeks = req.query['frequency-in-weeks']

    const error = validate(totalAmount, instalmentAmount, frequencyInWeeks)

    if (error) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error
        }
      })
    }

    const paymentPlan = new PaymentPlan(totalAmount, instalmentAmount, frequencyInWeeks)

    return res.status(HttpStatus.OK).json({
      paymentPlan: {
        paymentLength: paymentPlan.getPaymentLength(),
        lastPaymentDate: paymentPlan.getLastPaymentDate()
      }
    })
  })

function validate (totalAmount, instalmentAmount, frequencyInWeeks) {
  if (_.isEmpty(totalAmount)) {
    return '`total-amount` not provided'
  }
  if (_.isEmpty(instalmentAmount)) {
    return '`instalment-amount` not provided'
  }
  if (_.isEmpty(frequencyInWeeks)) {
    return '`frequency-in-weeks` not provided'
  }
}
