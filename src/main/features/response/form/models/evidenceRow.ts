import { IsDefined, IsIn, ValidateIf } from 'class-validator'

import { MaxLength } from 'forms/validation/validators/maxLengthValidator'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose type of evidence'
  static readonly DESCRIPTION_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ValidationConstants {
  static readonly DESCRIPTION_MAX_LENGTH: number = 99000
}

export class EvidenceType {
  static readonly CONTRACTS_AND_AGREEMENTS = 'CONTRACTS_AND_AGREEMENTS'
  static readonly EXPERT_WITNESS = 'EXPERT_WITNESS'
  static readonly CORRESPONDENCE = 'CORRESPONDENCE'
  static readonly PHOTO = 'PHOTO'
  static readonly RECEIPTS = 'RECEIPTS'
  static readonly STATEMENT_OF_ACCOUNT = 'STATEMENT_OF_ACCOUNT'
  static readonly OTHER = 'OTHER'

  static isValid (type: string): boolean {
    return EvidenceType.all().some(item => item === type)
  }

  static all (): string[] {
    return [
      EvidenceType.CONTRACTS_AND_AGREEMENTS,
      EvidenceType.EXPERT_WITNESS,
      EvidenceType.CORRESPONDENCE,
      EvidenceType.PHOTO,
      EvidenceType.RECEIPTS,
      EvidenceType.STATEMENT_OF_ACCOUNT,
      EvidenceType.OTHER
    ]
  }
}

export class EvidenceRow {

  @ValidateIf(o => o.type !== undefined)
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(EvidenceType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  @MaxLength(ValidationConstants.DESCRIPTION_MAX_LENGTH, { message: ValidationErrors.DESCRIPTION_TOO_LONG })
  description?: string

  constructor (type?: string, description?: string) {
    this.type = type
    this.description = description
  }

  static empty (): EvidenceRow {
    return new EvidenceRow(undefined, undefined)
  }

  static fromObject (value?: any): EvidenceRow {
    if (!value) {
      return value
    }

    const type: string = value.type || undefined
    const description: string = value.description || undefined

    return new EvidenceRow(type, description)
  }

  deserialize (input?: any): EvidenceRow {
    if (input) {
      this.type = input.type
      this.description = input.description
    }

    return this
  }
}
