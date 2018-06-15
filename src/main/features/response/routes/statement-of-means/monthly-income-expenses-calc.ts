import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { StatementOfMeansPaths } from 'response/paths'

export default express.Router()
  .get(StatementOfMeansPaths.totalIncomeOrExpensesCalculation.uri, (req, res) => {

    const amount: string = req.query['amount']
    const frequencyToMonths: string = req.query['frequency-to-months']

    const error: string = validate(amount, frequencyToMonths)

    if (error) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error
        }
      })
    }

    return res.status(HttpStatus.OK).json({

    })
  })


