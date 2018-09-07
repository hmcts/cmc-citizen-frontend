
import {IsNotBlank, IsValidLocalDate} from '@hmcts/cmc-validators'
import {IsDefined, MaxLength, ValidateIf, ValidateNested} from "class-validator";
import {LocalDate} from "forms/models/localDate"
import {ValidationConstraints} from "forms/models/timelineRow";
import {IsPastDate} from "forms/validation/validators/datePastConstraint";
import {MomentFormatter} from "utils/momentFormatter";
import {MomentFactory} from "shared/momentFactory";

export class ValidationErrors {
  static readonly DATE_TOO_LONG: string = 'Enter a date no longer than $constraint1 characters'
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_REQUIRED: string = 'Enter date'
  static readonly DATE_OUTSIDE_RANGE = () => {
    const currentDate = MomentFormatter.formatLongDate(MomentFactory.currentDate())
    return `Enter date before ${currentDate}`
  }
}
export class DatePaid {

  @ValidateNested()
  @IsPastDate({ message: ValidationErrors.DATE_OUTSIDE_RANGE })
  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @MaxLength(ValidationConstraints.DATE_MAX_LENGTH, { message: ValidationErrors.DATE_TOO_LONG })
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  date: LocalDate

  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (input?: any): DatePaid {
    if (input == null) {
      return input
    }
    return new DatePaid(input)
  }

  deserialize (input: any): DatePaid {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
