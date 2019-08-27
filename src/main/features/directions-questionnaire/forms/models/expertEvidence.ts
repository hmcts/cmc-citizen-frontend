import { CompletableTask } from 'models/task'
import {
  ValidationErrors as DefaultValidationErrors,
  ValidationErrors as GlobalValidationErrors
} from 'forms/validation/validationErrors'
import { IsDefined, IsIn, IsNotEmpty, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Explain what there is to examine'
}

export class ExpertEvidence implements CompletableTask {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: GlobalValidationErrors.YES_NO_REQUIRED })
  expertEvidence?: YesNoOption

  @ValidateIf(o => o.expertEvidence && o.expertEvidence.option === YesNoOption.YES.option)
  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  whatToExamine?: string

  constructor (expertEvidence?: YesNoOption, whatToExamine?: string) {
    this.expertEvidence = expertEvidence
    this.whatToExamine = whatToExamine
  }

  static fromObject (input: any): ExpertEvidence {
    if (!input) {
      return input
    }

    return new ExpertEvidence(YesNoOption.fromObject(input.expertEvidence), input.whatToExamine)
  }

  deserialize (input: any): ExpertEvidence {
    if (input && input.expertEvidence) {
      this.expertEvidence = YesNoOption.fromObject(input.expertEvidence.option)
      this.whatToExamine = input.whatToExamine
    }

    return this
  }

  isCompleted (): boolean {
    if (!this.expertEvidence) {
      return false
    } else if (this.expertEvidence === YesNoOption.YES) {
      return this.whatToExamine !== undefined
    } else {
      return true
    }
  }
}
