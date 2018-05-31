import * as request from 'supertest'
import * as HttpStatus from 'http-status-codes'

import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'
import PaymentPlan from 'common/paymentPlan'

describe.only('Payment plan calculation', () => {
  describe('on GET', () => {
    it('should return a [422] validation error when `total-amount` parameter is not provided', async () => {
      const instalmentAmount = 10
      const frequencyInWeeks = 2

      const queryParams = {
        'instalment-amount': instalmentAmount,
        'frequency-in-weeks': frequencyInWeeks
      }

      await request(app)
        .get(Paths.paymentPlanCalculation.uri)
        .query(queryParams)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY, {
          error: {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: '`total-amount` not provided'
          }
        })
    })

    it('should return a [422] validation error when `instalment` parameter is not provided', async () => {
      const totalAmount = 1000
      const frequencyInWeeks = 2

      const queryParams = {
        'total-amount': totalAmount,
        'frequency-in-weeks': frequencyInWeeks
      }

      await request(app)
        .get(Paths.paymentPlanCalculation.uri)
        .query(queryParams)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY, {
          error: {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: '`instalment-amount` not provided'
          }
        })
    })

    it('should return a [422] validation error when `frequency-in-weeks` parameter is not provided', async () => {
      const totalAmount = 1000
      const instalmentAmount = 10

      const queryParams = {
        'total-amount': totalAmount,
        'instalment-amount': instalmentAmount
      }

      await request(app)
        .get(Paths.paymentPlanCalculation.uri)
        .query(queryParams)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY, {
          error: {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: '`frequency-in-weeks` not provided'
          }
        })
    })

    it('should return a ', async () => {
      const totalAmount = 1000
      const instalmentAmount = 10
      const frequencyInWeeks = 2
      const paymentPlan = new PaymentPlan(totalAmount, instalmentAmount, frequencyInWeeks)

      const queryParams = {
        'total-amount': totalAmount,
        'instalment-amount': instalmentAmount
        'frequency-in-weeks': frequencyInWeeks
      }

      await request(app)
        .get(Paths.paymentPlanCalculation.uri)
        .query(queryParams)
        .expect(HttpStatus.OK, {
          paymentPlan: {
            paymentLength: ,
            lastPaymentDate: '`frequency-in-weeks` not provided'
          }
        })
    })

    // it('should return the payment plan', async () => {
    //   await request(app)
    //     .get(Paths.paymentPlanCalculation.uri)
    //     .expect(res => console.log(res.body))
    // })
  })
})
