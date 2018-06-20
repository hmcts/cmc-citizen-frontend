import { IncomeExpenseSchedule } from 'common/incomeExpenseSchedule'

import * as request from 'supertest'
import { expect } from 'chai'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { Paths } from 'paths'
import {IncomeExpenseSource} from "common/calculateMonthlyIncomeExpense";

describe.only('Monthly Income Expenses Calculation', () => {
  attachDefaultHooks(app)

  describe('when income expense details are correct', () => {

    it('should return ok', async () => {

      const incomeExpenseSource: IncomeExpenseSource[] = [
        { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.WEEK }
      ]

      await request(app)
        .post(Paths.totalIncomeOrExpensesCalculation.uri)
        .send(incomeExpenseSource)
        .expect(res => expect(res).to.be.successful.withText('400'))
    })
  })
})
