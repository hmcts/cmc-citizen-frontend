import { IsDefined, IsIn, ValidateIf } from '@hmcts/class-validator'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'
import { ReportRow } from 'directions-questionnaire/forms/models/reportRow'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { YesNoOption } from 'models/yesNoOption'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW = 'Enter at least one report'
}

export class ExpertReports extends MultiRowForm<ReportRow> {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared?: YesNoOption

  @ValidateIf(o => o.declared === YesNoOption.YES)
  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: ReportRow[]

  constructor (declared?: YesNoOption, rows?: ReportRow[]) {
    super(rows)
    this.declared = declared
  }

  public static fromObject (value?: any): ExpertReports {
    if (!value) {
      return value
    }

    return new ExpertReports(
      YesNoOption.fromObject(value.declared),
      (value.declared === YesNoOption.YES.option && value.rows) ? value.rows.map(ReportRow.fromObject) : []
    )
  }

  canAddMoreRows (): boolean {
    return true
  }

  createEmptyRow (): ReportRow {
    return ReportRow.empty()
  }

  deserialize (input?: any): ExpertReports {
    if (input) {
      this.declared = input.declared
      this.rows = this.deserializeRows(input.rows).filter(item => !item.isEmpty())
    }

    return this
  }
}
