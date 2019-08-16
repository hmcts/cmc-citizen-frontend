import { IsDefined, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { IsBooleanTrue, IsNotBlank } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { SignatureType } from 'common/signatureType'

export class ValidationErrors {
  static readonly STATEMENT_OF_TRUTH_REQUIRED_MESSAGE: string = 'Tell us if you believe the facts stated in this response are true.'
  static readonly SIGNER_NAME_REQUIRED: string = 'Enter the name of the person signing the statement'
  static readonly SIGNER_NAME_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly SIGNER_ROLE_REQUIRED: string = 'Enter the role of the person signing the statement'
  static readonly SIGNER_ROLE_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE: string = 'Tell us if you believe the hearing requirement details on this page are true.'

}

export class QualifiedStatementOfTruth {
  type: string = SignatureType.QUALIFIED

  @IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  signed?: boolean

  @ValidateIf(o => o.type === SignatureType.DIRECTION_QUESTIONNAIRE)
  @IsDefined({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
  directionsQuestionnaireSigned?: boolean

  @IsDefined({ message: ValidationErrors.SIGNER_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SIGNER_NAME_REQUIRED })
  @MaxLength(70, { message: ValidationErrors.SIGNER_NAME_TOO_LONG })
  signerName?: string

  @IsDefined({ message: ValidationErrors.SIGNER_ROLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SIGNER_ROLE_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.SIGNER_ROLE_TOO_LONG })
  signerRole?: string

  constructor (signed?: boolean, directionsQuestionnaireSigned?: boolean, signerName?: string, signerRole?: string) {
    this.signed = signed
    this.directionsQuestionnaireSigned = directionsQuestionnaireSigned
    this.signerName = signerName
    this.signerRole = signerRole
  }

  static fromObject (value?: any): QualifiedStatementOfTruth {
    if (!value) {
      return value
    }
    return new QualifiedStatementOfTruth((value.signed && toBoolean(value.signed) === true),(value.directionsQuestionnaireSigned && toBoolean(value.directionsQuestionnaireSigned) === true), value.signerName, value.signerRole)
  }

  deserialize (input?: any): QualifiedStatementOfTruth {
    if (input) {
      this.signerName = input.signerName
      this.signerRole = input.signerRole
    }
    return this
  }
}
