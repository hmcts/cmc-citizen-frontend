import { MultiRowForm } from 'forms/models/multiRowForm'
import { BankAccountRow } from 'response/form/models/statement-of-means/bankAccountRow'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 2

export class BankAccounts extends MultiRowForm<BankAccountRow> {

  static fromObject (value?: any): BankAccounts {
    if (!value) {
      return value
    }

    return new BankAccounts(value.rows ? value.rows.map(BankAccountRow.fromObject) : [])
  }

  createEmptyRow (): BankAccountRow {
    return BankAccountRow.empty()
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_ROWS
  }
}
