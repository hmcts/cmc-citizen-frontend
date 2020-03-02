import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { LocalDate } from 'forms/models/localDate'
import { IsDefined, MaxLength, ValidateIf, ValidateNested } from '@hmcts/class-validator'
import {
  ValidationErrors as DefaultValidationErrors,
  ValidationErrors as GlobalValidationErrors
} from 'forms/validation/validationErrors'
import { IsNotBlank, IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsPastDate } from 'forms/validation/validators/datePastConstraint'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly NAME_REQUIRED = 'Enter the expert’s name'
  static readonly DATE_REQUIRED = GlobalValidationErrors.DATE_REQUIRED
  static readonly PAST_DATE_REQUIRED = GlobalValidationErrors.DATE_IN_FUTURE
  static readonly VALID_DATE_REQUIRED = GlobalValidationErrors.DATE_NOT_VALID
}

export class ReportRow extends MultiRowFormItem {

  @ValidateIf(o => o.reportDate && o.reportDate !== new LocalDate())
  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  expertName?: string

  @ValidateIf(o => !!o.expertName)
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: ValidationErrors.VALID_DATE_REQUIRED })
  @IsPastDate({ message: ValidationErrors.PAST_DATE_REQUIRED })

  @ValidateNested()
  reportDate?: LocalDate

  constructor (expertName?: string, reportDate?: LocalDate) {
    super()
    this.expertName = expertName
    this.reportDate = reportDate
  }

  static empty (): ReportRow {
    return new ReportRow(undefined, undefined)
  }

  static fromObject (value?: any): ReportRow {
    if (!value) {
      return value
    }

    const expertName: string = value.expertName || undefined
    let reportDate: LocalDate = undefined
    if (value.reportDate && (value.reportDate.year || value.reportDate.month || value.reportDate.day)) {
      reportDate = LocalDate.fromObject(value.reportDate)
    }

    return new ReportRow(expertName, reportDate)
  }

  deserialize (input?: any): ReportRow {
    if (input) {
      this.expertName = input.expertName

      if (input.reportDate) {
        this.reportDate = new LocalDate().deserialize(input.reportDate)
      }
    }

    return this
  }
}
