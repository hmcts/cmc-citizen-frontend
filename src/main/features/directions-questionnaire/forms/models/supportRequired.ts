import { IsDefined, IsNotEmpty, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly NO_LANGUAGE_ENTERED = 'Enter the language that needs to be interpreted'
  static readonly NO_SIGN_LANGUAGE_ENTERED = 'Enter the sign language you need'
  static readonly NO_OTHER_SUPPORT = 'Enter the other support you need at your hearing'
}

export class SupportRequired {
  languageSelected?: boolean
  @ValidateIf(o => o.languageSelected)
  @IsDefined({ message: ValidationErrors.NO_LANGUAGE_ENTERED })
  @IsNotEmpty({ message: ValidationErrors.NO_LANGUAGE_ENTERED })
  @IsNotBlank({ message: ValidationErrors.NO_LANGUAGE_ENTERED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  languageInterpreted?: string

  signLanguageSelected?: boolean
  @ValidateIf(o => o.signLanguageSelected)
  @IsDefined({ message: ValidationErrors.NO_SIGN_LANGUAGE_ENTERED })
  @IsNotEmpty({ message: ValidationErrors.NO_SIGN_LANGUAGE_ENTERED })
  @IsNotBlank({ message: ValidationErrors.NO_SIGN_LANGUAGE_ENTERED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })

  signLanguageInterpreted?: string

  hearingLoopSelected?: boolean

  disabledAccessSelected?: boolean

  otherSupportSelected?: boolean
  @ValidateIf(o => o.otherSupportSelected)
  @IsDefined({ message: ValidationErrors.NO_OTHER_SUPPORT })
  @IsNotEmpty({ message: ValidationErrors.NO_OTHER_SUPPORT })
  @IsNotBlank({ message: ValidationErrors.NO_OTHER_SUPPORT })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })

  otherSupport?: string

  constructor (
    languageSelected?: boolean, languageInterpreted?: string,
    signLanguageSelected?: boolean, signLanguageInterpreted?: string,
    hearingLoopSelected?: boolean,
    disabledAccessSelected?: boolean,
    otherSupportSelected?: boolean, otherSupport?: string
  ) {
    this.languageSelected = languageSelected
    this.languageInterpreted = languageInterpreted
    this.signLanguageSelected = signLanguageSelected
    this.signLanguageInterpreted = signLanguageInterpreted
    this.hearingLoopSelected = hearingLoopSelected
    this.disabledAccessSelected = disabledAccessSelected
    this.otherSupportSelected = otherSupportSelected
    this.otherSupport = otherSupport
  }

  static fromObject (input?: any): SupportRequired {
    if (!input) {
      return input
    }

    return new SupportRequired(
      input.languageSelected,
      input.languageInterpreted,
      input.signLanguageSelected,
      input.signLanguageInterpreted,
      input.hearingLoopSelected,
      input.disabledAccessSelected,
      input.otherSupportSelected,
      input.otherSupport
    )
  }

  deserialize (input?: any): SupportRequired {
    if (input) {
      this.languageSelected = input.languageSelected
      this.languageInterpreted = input.languageInterpreted
      this.signLanguageSelected = input.signLanguageSelected
      this.signLanguageInterpreted = input.signLanguageInterpreted
      this.hearingLoopSelected = input.hearingLoopSelected
      this.disabledAccessSelected = input.disabledAccessSelected
      this.otherSupportSelected = input.otherSupportSelected
      this.otherSupport = input.otherSupport
    }

    return this
  }
}
