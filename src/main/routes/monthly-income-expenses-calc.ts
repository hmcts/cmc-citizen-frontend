import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'main/app/paths'
import { CalculateMonthlyIncomeExpense } from 'main/app/common/calculateMonthlyIncomeExpense'
import { ValidationError, Validator } from 'class-validator'
import { IncomeExpenseSources } from 'common/incomeExpenseSources'

export default express.Router()
  .post(Paths.totalIncomeOrExpensesCalculation.uri, (req, res) => {

    const incomeExpenseSources: IncomeExpenseSources = IncomeExpenseSources.fromObject(req.body)

    const validator: Validator = new Validator()
    let error: ValidationError[] = validator.validateSync(incomeExpenseSources)

    if (error.length > 0) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error)
    }

    const totalMonthlyIncomeExpense = CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeExpenseSources.incomeExpenseSources)
    return res.status(HttpStatus.OK).json({
      totalMonthlyIncomeExpense: totalMonthlyIncomeExpense
    })
  })
