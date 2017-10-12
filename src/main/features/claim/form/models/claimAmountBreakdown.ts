import { ValidateNested } from 'class-validator'

import { Serializable } from 'app/models/serializable'
import { ClaimAmountRow } from 'features/claim/form/models/claimAmountRow'
import { MinTotal } from 'app/forms/validation/validators/minTotal'

const INIT_ROW_COUNT: number = 4
export const MAX_NUMBER_OF_ROWS: number = 20

export class ValidationErrors {
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount of money'
}

export class ClaimAmountBreakdown implements Serializable<ClaimAmountBreakdown> {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  @MinTotal(0.01, { message: ValidationErrors.AMOUNT_REQUIRED })
  rows: ClaimAmountRow[]

  constructor (rows: ClaimAmountRow[] = ClaimAmountBreakdown.initialRows()) {
    this.rows = rows
  }

  static fromObject (value?: any): ClaimAmountBreakdown {
    if (!value) {
      return value
    }

    return new ClaimAmountBreakdown(value.rows ? value.rows.map(ClaimAmountRow.fromObject) : [])
  }

  private static initialRows (rows: number = INIT_ROW_COUNT): ClaimAmountRow[] {
    return new Array(rows).fill(ClaimAmountRow.empty())
  }

  deserialize (input?: any): ClaimAmountBreakdown {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    if (this.rows.length < MAX_NUMBER_OF_ROWS) {
      this.rows.push(ClaimAmountRow.empty())
    }
  }

  removeExcessRows () {
    this.rows = this.rows.filter(item => !!item.amount && !!item.reason)

    if (this.rows.length === 0) {
      this.appendRow()
    }
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

    let claimAmountRows: ClaimAmountRow[] = rows.map(row => new ClaimAmountRow().deserialize(row))

    if (rows.length < INIT_ROW_COUNT) {
      claimAmountRows = claimAmountRows.concat(ClaimAmountBreakdown.initialRows(INIT_ROW_COUNT - rows.length))
    }

    return claimAmountRows
  }

}
