import { CompletableTask } from 'models/task'
import {
  ValidationErrors as DefaultValidationErrors,
  ValidationErrors as GlobalValidationErrors
} from 'forms/validation/validationErrors'
import { IsDefined, IsIn, IsNotEmpty, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { IsNotBlank } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Please tell us why'
}

export class DeterminationWithoutHearingQuestions implements CompletableTask {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: GlobalValidationErrors.YES_NO_REQUIRED })
  determinationWithoutHearingQuestions?: YesNoOption

  @ValidateIf(o => o.determinationWithoutHearingQuestions.option === YesNoOption.NO.option)
  @IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED })
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  determinationWithoutHearingQuestionsDetails?: string

  constructor (determinationWithoutHearingQuestions?: YesNoOption, determinationWithoutHearingQuestionsDetails?: string) {
    this.determinationWithoutHearingQuestions = determinationWithoutHearingQuestions
    this.determinationWithoutHearingQuestionsDetails = determinationWithoutHearingQuestionsDetails
  }

  static fromObject (input: any): DeterminationWithoutHearingQuestions {
    if (!input) {
      return input
    }

    return new DeterminationWithoutHearingQuestions(YesNoOption.fromObject(input.determinationWithoutHearingQuestions), input.determinationWithoutHearingQuestionsDetails)
  }

  deserialize (input: any): DeterminationWithoutHearingQuestions {
    if (input && input.determinationWithoutHearingQuestions) {
      this.determinationWithoutHearingQuestions = YesNoOption.fromObject(input.determinationWithoutHearingQuestions.option)
      if (this.determinationWithoutHearingQuestions === YesNoOption.YES) {
        this.determinationWithoutHearingQuestionsDetails = ' '
      } else {
        this.determinationWithoutHearingQuestionsDetails = input.determinationWithoutHearingQuestionsDetails
      }
    }

    return this
  }

  isCompleted (): boolean {
    if (!this.determinationWithoutHearingQuestions) {
      return false
    } else if (this.determinationWithoutHearingQuestions === YesNoOption.NO) {
      return this.determinationWithoutHearingQuestionsDetails !== undefined
    } else {
      return true
    }
  }
}
