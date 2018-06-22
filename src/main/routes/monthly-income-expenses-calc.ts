import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import {Paths} from 'main/app/paths'
import {CalculateMonthlyIncomeExpense} from 'main/app/common/calculateMonthlyIncomeExpense'
import {IncomeExpenseSource} from 'main/app/common/incomeExpenseSource'
import {ValidationError, Validator} from 'class-validator'
import {IncomeExpenseSources} from "common/incomeExpenseSources";
// import { Router } from 'express'
// import { IncomeExpenseSources } from 'common/incomeExpenseSources'

export default express.Router()
  .post(Paths.totalIncomeOrExpensesCalculation.uri, async (req, res) => {

    const incomeExpenseSource: IncomeExpenseSource[] = req.body.incomeExpenseSources
    const incomeExpenseSources: IncomeExpenseSources = new IncomeExpenseSources(incomeExpenseSource)

    const error: ValidationError[] = await validateIncomeExpenseSource(incomeExpenseSources)

      console.log('error--->',error)

    if (error.length > 0) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error
        }
      })
    }

    const totalMonthlyIncomeExpense = CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeExpenseSource)
    return res.status(HttpStatus.OK).json({
      totalMonthlyIncomeExpense: totalMonthlyIncomeExpense
    })
  })

async function validateIncomeExpenseSource (incomeExpenseSources: IncomeExpenseSources): Promise<ValidationError[]> {
  const validator: Validator = new Validator()
  const errors: ValidationError[] = await validator.validate(incomeExpenseSources)
  console.log('errors-->',errors)
  return errors
}
