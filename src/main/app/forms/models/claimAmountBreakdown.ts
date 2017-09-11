import { ValidateNested } from 'class-validator'

import { Serializable } from 'models/serializable'
import ClaimAmountRow from 'forms/models/claimAmountRow'
import { MinTotal } from 'app/forms/validation/validators/minTotal'

const initialRowsCount: number = 4

export class ValidationErrors {
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount of money'
}

export default class ClaimAmountBreakdown implements Serializable<ClaimAmountBreakdown> {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  @MinTotal(0.01, { message: ValidationErrors.AMOUNT_REQUIRED })
  rows: ClaimAmountRow[]

  constructor (rows: ClaimAmountRow[] = ClaimAmountBreakdown.initialRows()) {
    this.rows = rows
  }

  static initialRows (): ClaimAmountRow[] {
    let rows: ClaimAmountRow[] = []

    for (let i = 0; i < initialRowsCount; i++) {
      rows.push(ClaimAmountRow.empty())
    }

    return rows
  }

  static fromObject (value?: any): ClaimAmountBreakdown {
    if (!value) {
      return value
    }

    return new ClaimAmountBreakdown(value.rows ? value.rows.map(ClaimAmountRow.fromObject) : [])
  }

  deserialize (input?: any): ClaimAmountBreakdown {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    this.rows.push(ClaimAmountRow.empty())
  }

  totalAmount () {
    let total: number = 0.00

    for (let row in this.rows) {
      if (this.rows[row].amount && this.rows[row].amount > 0) {
        total += this.rows[row].amount
      }
    }

    return total
  }

  private deserializeRows (rows: any): ClaimAmountRow[] {
    if (!rows) {
      return ClaimAmountBreakdown.initialRows()
    }

    let claimAmountRows: ClaimAmountRow[] = []

    for (let row in rows) {
      claimAmountRows.push(new ClaimAmountRow().deserialize(rows[row]))
    }

    for (let i = 0; i < initialRowsCount - rows.length; i++) {
      claimAmountRows.push(ClaimAmountRow.empty())
    }

    return claimAmountRows
  }

}
