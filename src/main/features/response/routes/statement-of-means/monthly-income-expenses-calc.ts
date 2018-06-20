import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'paths'
import { calculateTotalAmount, IncomeExpenseSource } from 'common/calculateMonthlyIncomeExpense'

export default express.Router()
  .post(Paths.totalIncomeOrExpensesCalculation.uri, (req: express.Request, res: express.Response) => {

    const incomeExpenseSource: IncomeExpenseSource[] = req.body.incomeExpenseSource

    console.log(incomeExpenseSource)

    // const error: string = isIncomeExpenseSource(incomeExpenseSource)
    //
    // if (error) {
    //   return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
    //     error: {
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       message: error
    //     }
    //   })
    // }

    const totalAmount: number = calculateTotalAmount(incomeExpenseSource)

    console.log('totalAmount-->',calculateTotalAmount(incomeExpenseSource))

    return res.status(HttpStatus.OK).type(totalAmount.toString())
  })

function isIncomeExpenseSource (object: any): string {
  if (object as IncomeExpenseSource[]) {
    return `'${object}' is not of type IncomeExpenseSource`
  }
}
