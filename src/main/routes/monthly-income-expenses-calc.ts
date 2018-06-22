import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'main/app/paths'
import { CalculateMonthlyIncomeExpense } from 'main/app/common/calculateMonthlyIncomeExpense'
import { IncomeExpenseSource } from 'main/app/common/incomeExpenseSource'
import { ValidationError, Validator } from 'class-validator'
import {IncomeExpenseSources} from "common/incomeExpenseSources"
// import { Router } from 'express'
// import { IncomeExpenseSources } from 'common/incomeExpenseSources'

export default express.Router()
  .post(Paths.totalIncomeOrExpensesCalculation.uri, async (req, res) => {

    const incomeExpenseSource: IncomeExpenseSource[] = req.body.incomeExpenseSources

    const validator: Validator = new Validator()
    let error: ValidationError[] = validator.validateSync(new IncomeExpenseSource())

    console.log('error--->',error)

    const totalMonthlyIncomeExpense = CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeExpenseSource)
    return res.status(HttpStatus.OK).json({
      totalMonthlyIncomeExpense: totalMonthlyIncomeExpense
    })
  })
