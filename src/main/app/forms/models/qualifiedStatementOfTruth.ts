import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { IsNotBlank, IsBooleanTrue } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { StatementOfTruth } from 'forms/models/statementOfTruth'
import { SignatureType } from 'common/signatureType'

export class ValidationErrors {
  static readonly STATEMENT_OF_TRUTH_REQUIRED_MESSAGE: string = 'Please select I believe that the facts stated in this claim are true.'
  static readonly SIGNER_NAME_REQUIRED: string = 'Enter the name of the person signing the statement'
  static readonly SIGNER_NAME_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly SIGNER_ROLE_REQUIRED: string = 'Enter the role of the person signing the statement'
  static readonly SIGNER_ROLE_TOO_LONG: string = 'You’ve entered too many characters'
}

export class QualifiedStatementOfTruth extends StatementOfTruth {
  @IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  signed?: boolean

  @IsDefined({ message: ValidationErrors.SIGNER_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SIGNER_NAME_REQUIRED })
  @MaxLength(70, { message: ValidationErrors.SIGNER_NAME_TOO_LONG })
  signerName?: string

  @IsDefined({ message: ValidationErrors.SIGNER_ROLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SIGNER_ROLE_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.SIGNER_ROLE_TOO_LONG })
  signerRole?: string

  constructor (signed?: boolean, signerName?: string, signerRole?: string) {
    super()
    this.type = SignatureType.QUALIFIED
    this.signed = signed
    this.signerName = signerName
    this.signerRole = signerRole
  }

  static fromObject (value?: any): QualifiedStatementOfTruth {
    if (!value) {
      return value
    }
    return new QualifiedStatementOfTruth((value.signed && toBoolean(value.signed) === true), value.signerName, value.signerRole)
  }

  deserialize (input?: any): QualifiedStatementOfTruth {
    if (input) {
      this.signerName = input.signerName
      this.signerRole = input.signerRole
    }
    return this
  }
}
