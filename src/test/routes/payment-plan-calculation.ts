import * as moment from 'moment'
import * as sinon from 'sinon'

import * as request from 'supertest'
import * as HttpStatus from 'http-status-codes'

import * as paymentPlan from 'common/paymentPlan'

import { app } from 'main/app'
import { Paths } from 'paths'

describe('Payment plan calculation', () => {
  describe('on GET', () => {
    describe('when not all query parameters are provided', () => {
      it('should return a [422] validation error when `total-amount` parameter is not provided', async () => {

        const queryParams = {
          'instalment-amount': 10,
          'frequency-in-weeks': 2
        }

        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'total-amount\' not provided')
      })

      it('should return a [422] validation error when `instalment` parameter is not provided', async () => {

        const queryParams = {
          'total-amount': 1000,
          'frequency-in-weeks': 2
        }

        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'instalment-amount\' not provided')
      })

      it('should return a [422] validation error when `frequency-in-weeks` parameter is not provided', async () => {

        const queryParams = {
          'total-amount': 1000,
          'instalment-amount': 10
        }

        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'frequency-in-weeks\' not provided')
      })
    })

    describe('when not all query parameters are numbers', () => {
      it('should return a [422] validation error when `total-amount` parameter is not a number', async () => {

        const queryParams = {
          'total-amount': 'NaN',
          'instalment-amount': 10,
          'frequency-in-weeks': 2
        }

        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'total-amount\' must be a positive number')
      })

      it('should return a [422] validation error when `instalment-amount` parameter is not a number', async () => {

        const queryParams = {
          'total-amount': 1000,
          'instalment-amount': 'NaN',
          'frequency-in-weeks': 2
        }
        
        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'instalment-amount\' must be a positive number')
      })

      it('should return a [422] validation error when `frequency-in-weeks` parameter is not a number', async () => {
        const queryParams = {
          'total-amount': 1000,
          'instalment-amount': 10,
          'frequency-in-weeks': 'NaN'
        }
        
        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'frequency-in-weeks\' must be a positive number')
      })
    })

    describe('when not all query parameters are positive number', () => {
      it('should return a [422] validation error when `total-amount` parameter is not a posivive number', async () => {
        const queryParams = {
          'total-amount': 0,
          'instalment-amount': 10,
          'frequency-in-weeks': 2
        }
        
        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'total-amount\' must be a positive number')
      })

      it('should return a [422] validation error when `instalment` parameter is not a positive number', async () => {
        const queryParams = {
          'total-amount': 1000,
          'instalment-amount': 0,
          'frequency-in-weeks': 2
        }
        
        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'instalment-amount\' must be a positive number')
      })

      it('should return a [422] validation error when `frequency-in-weeks` parameter is not a positive number', async () => {
        const queryParams = {
          'total-amount': 1000,
          'instalment-amount': 10,
          'frequency-in-weeks': 0
        }
        
        await paymentPlanCalculationShouldReturnValidationError(queryParams, '\'frequency-in-weeks\' must be a positive number')
      })
      })
    })
  })

  describe('when all query parameters are provided', () => {

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

async function paymentPlanCalculationShouldReturnValidationError(queryParams: object, expectedErrorMessage: string) {
  await request(app)
    .get(Paths.paymentPlanCalculation.uri)
    .query(queryParams)
    .expect(HttpStatus.UNPROCESSABLE_ENTITY, {
      error: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: expectedErrorMessage
      }
    })
}
