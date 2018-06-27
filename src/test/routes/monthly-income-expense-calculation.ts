import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import * as request from 'supertest'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { Paths } from 'paths'
import * as HttpStatus from 'http-status-codes'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from '../app/forms/models/validationUtils'

describe.only('Monthly Income Expenses Calculation', () => {
  attachDefaultHooks(app)

  describe('when income expense details are correct', () => {

    it('should return OK ', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          {
            'amount': 100,
            'schedule': IncomeExpenseSchedule.MONTH.value
          }
        ]
      }

      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSources)
        .expect(HttpStatus.OK, {'totalMonthlyIncomeExpense': 100})
    })
  })

  describe('when income expense details are incorrect', () => {
    it('should return error when `schedule` is invalid in one of the `incomeExpenseSources` items', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          {
            'amount': 100,
            'schedule': 'INVALID'
          }
        ]
      }
      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSources)
        .expect(res => expectValidationError(res.body, GlobalValidationErrors.SELECT_AN_OPTION))
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
    })

    it('should return error when `schedule` is missing in one of the `incomeExpenseSources` items', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          {
            'amount': 100
          }
        ]
      }
      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSources)
        .expect(res => expectValidationError(res.body, GlobalValidationErrors.SELECT_AN_OPTION))
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
    })

    it('should return error when `amount` is invalid in one of the `incomeExpenseSources` items', async () => {

        const incomeExpenseSources = {
          incomeExpenseSources: [
            {
              'amount': 20.123,
              'schedule': IncomeExpenseSchedule.MONTH
            }
          ]
        }
        await request(app)
          .post(Paths.totalIncomeOrExpensesCalculation.uri)
          .send(incomeExpenseSources)
          .expect(res => expectValidationError(res.body,
            GlobalValidationErrors.NUMBER_REQUIRED && 
            GlobalValidationErrors.AMOUNT_INVALID_DECIMALS))
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      })

    it('should return error when `amount` is missing in one of the `incomeExpenseSources` items', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          {
            'schedule': IncomeExpenseSchedule.MONTH
          }
        ]
      }
      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSources)
        .expect(res => expectValidationError(res.body,
          GlobalValidationErrors.NUMBER_REQUIRED && 
          GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED))
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
    })

    it('should return error when `incomeExpenseSources` is not an array', async () => {

        const incomeExpenseSources = {
            incomeExpenseSources: "not an array"
        }
        await request(app)
          .post(Paths.totalIncomeOrExpensesCalculation.uri)
          .send(incomeExpenseSources)
          .expect(res => expectValidationError(res.body, 'incomeExpenseSources must be an array'))
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      })
  })
})
