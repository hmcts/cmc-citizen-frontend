import { IncomeExpenseSchedule } from '../../main/app/common/incomeExpenseSchedule'
import * as request from 'supertest'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { Paths } from 'paths'
import * as HttpStatus from 'http-status-codes'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError } from '../app/forms/models/validationUtils'

describe('Monthly Income Expenses Calculation', () => {
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
    it('should return error', async () => {

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

    it('should return error when Income Expense Schedule missing in IncomeExpenseSource', async () => {

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

    it('should return error when amount is missing in IncomeExpenseSource', async () => {

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
          GlobalValidationErrors.NUMBER_REQUIRED && GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED))
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
    })
  })
})
