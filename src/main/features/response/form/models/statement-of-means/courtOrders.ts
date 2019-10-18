import { MultiRowForm } from 'forms/models/multiRowForm'
import { IsDefined, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import * as toBoolean from 'to-boolean'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'
import { CourtOrderRow } from 'response/form/models/statement-of-means/courtOrderRow'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW: string = 'Enter at least one court order'
}

export const MAX_NUMBER_OF_ROWS: number = 10

export class CourtOrders extends MultiRowForm<CourtOrderRow> {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared: boolean

  @ValidateIf(o => o.declared === true)
  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: CourtOrderRow[]

  constructor (declared?: boolean, rows?: CourtOrderRow[]) {
    super(rows)
    this.declared = declared
  }

  static fromObject (value?: any): CourtOrders {
    if (!value) {
      return value
    }

    const declared: boolean = (value.declared !== undefined) ? toBoolean(value.declared) : undefined

    return new CourtOrders(
      declared,
      (declared === true && value.rows) ? value.rows.map(CourtOrderRow.fromObject) : []
    )
  }

  createEmptyRow (): CourtOrderRow {
    return CourtOrderRow.empty()
  }

  deserialize (input?: any): CourtOrders {
    if (input) {
      this.declared = input.declared
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_ROWS
  }
}
