import * as moment from 'moment'
import * as sinon from 'sinon'

import * as request from 'supertest'
import * as HttpStatus from 'http-status-codes'

import * as paymentPlan from 'common/paymentPlan'

import { app } from 'main/app'
import { Paths } from 'paths'

describe('Payment plan calculation when not all query parameters are passed - negative test', () => {
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
  })

  describe('Payment plan calcuation when all query parameters are passed - positive test', () => {

    before(() => {
      const mockedPaymentPlan = {
        getPaymentLength: () => '3 days',
        getLastPaymentDate: () => moment('2018-01-01')
      }

      const createPaymentPlanStub = sinon.stub(paymentPlan, 'createPaymentPlan')
      createPaymentPlanStub.returns(mockedPaymentPlan)
    })

    it('should return payment plan calculations for given data', async () => {
      const totalAmount = 1000
      const instalmentAmount = 10
      const frequencyInWeeks = 2

      const queryParams = {
        'total-amount': totalAmount,
        'instalment-amount': instalmentAmount,
        'frequency-in-weeks': frequencyInWeeks
      }

      await request(app)
        .get(Paths.paymentPlanCalculation.uri)
        .query(queryParams)
        .expect(HttpStatus.OK, {
          paymentPlan: {
            paymentLength: '3 days',
            lastPaymentDate: moment('2018-01-01').toJSON()
          }
        })
    })
  })
})
