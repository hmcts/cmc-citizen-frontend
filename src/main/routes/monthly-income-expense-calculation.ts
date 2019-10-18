import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'main/app/paths'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { ValidationError, Validator } from '@hmcts/class-validator'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'

/* tslint:disable:no-default-export */
export default express.Router()
  .post(Paths.totalIncomeOrExpensesCalculation.uri, async (req: express.Request, res: express.Response) => {
    try {
      const incomeExpenseSources: IncomeExpenseSources = IncomeExpenseSources.fromObject(req.body)

      const validator: Validator = new Validator()
      const error: ValidationError[] = await validator.validate(incomeExpenseSources)
      if (error.length > 0) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error)
      }

      const totalMonthlyIncomeExpense = CalculateMonthlyIncomeExpense
        .calculateTotalAmount(incomeExpenseSources.incomeExpenseSources)
      return res.status(HttpStatus.OK).json({
        totalMonthlyIncomeExpense: totalMonthlyIncomeExpense
      })
    } catch (err) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err)
    }
  })
