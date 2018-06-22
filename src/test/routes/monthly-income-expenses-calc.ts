import { IncomeExpenseSchedule } from '../../main/app/common/incomeExpenseSchedule'

import * as request from 'supertest'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { Paths } from 'paths'
import * as HttpStatus from 'http-status-codes'

describe('Monthly Income Expenses Calculation', () => {
  attachDefaultHooks(app)

  describe('when income expense details are correct', () => {

    it('should return ok', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          { 'amount': 100, 'schedule': IncomeExpenseSchedule.WEEK },
          { 'amount': 100, 'schedule': IncomeExpenseSchedule.TWO_WEEKS }
        ]
      }

      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSources)
        .expect(HttpStatus.OK, { 'totalMonthlyIncomeExpense' : 650 })
    })
  })

  describe.only('when income expense details are incorrect', () => {

    it('should return error', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          { 'amount': 'INVALID', 'schedule': IncomeExpenseSchedule.WEEK }
        ]
      }

      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSources)
        .expect(HttpStatus.OK, { 'totalMonthlyIncomeExpense' : 650 })
    })
  })
})
