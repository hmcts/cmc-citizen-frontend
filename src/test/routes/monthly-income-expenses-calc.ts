import { IncomeExpenseSchedule } from '../../main/app/common/incomeExpenseSchedule'

import * as request from 'supertest'
import { app } from 'main/app'
import { attachDefaultHooks } from 'test/routes/hooks'
import { Paths } from 'paths'
import * as HttpStatus from 'http-status-codes'
import {ValidationErrors as GlobalValidationErrors} from "forms/validation/validationErrors";
import {expectValidationError} from "../app/forms/models/validationUtils";
import {IncomeExpenseSource} from "common/incomeExpenseSource";
import {expect} from "chai";

describe('Monthly Income Expenses Calculation', () => {
  attachDefaultHooks(app)

  describe('when income expense details are correct', () => {

    it('should return ok', async () => {

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
        .expect(HttpStatus.OK, { 'totalMonthlyIncomeExpense' : 100 })
    })
  })

  describe.only('when income expense details are incorrect', () => {
    it('should return error', async () => {

      const incomeExpenseSources = {
        incomeExpenseSources: [
          {
            'amount': 100,
            'schedule': 'INVALID'
          }
        ]
      }

      await totalIncomeExpenseCalculatorShouldReturnValidationError(incomeExpenseSources, 'Select an option')
    })
  })
})

async function totalIncomeExpenseCalculatorShouldReturnValidationError (input: object, expectedErrorMessage: string) {
  await request(app)
    .post(Paths.totalIncomeOrExpensesCalculation.uri)
    .send(input)
    .expect(HttpStatus.UNPROCESSABLE_ENTITY, {
      error: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: expectedErrorMessage
      }
    })
}
