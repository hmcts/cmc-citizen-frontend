import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { IsBooleanTrue, IsNotBlank } from '@hmcts/cmc-validators'
import { SignatureType } from 'common/signatureType'
import * as toBoolean from 'to-boolean'
import { Declaration } from 'ccj/form/models/declaration'

/**
 * We cannot reuse StatementOfTruth class as for legal reason error message must be different.
 */
export class ValidationErrors {
  static readonly DECLARATION_REQUIRED: string = 'Please select \'I declare that the details I have given are true to the best of my knowledge\''
  static readonly SIGNER_NAME_REQUIRED: string = 'Enter the name of the person signing the declaration'
  static readonly SIGNER_NAME_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly SIGNER_ROLE_REQUIRED: string = 'Enter the role of the person signing the declaration'
  static readonly SIGNER_ROLE_TOO_LONG: string = 'You’ve entered too many characters'
}

export class QualifiedDeclaration extends Declaration {
  @IsDefined({ message: ValidationErrors.DECLARATION_REQUIRED })
  @IsBooleanTrue({ message: ValidationErrors.DECLARATION_REQUIRED })
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

  static fromObject (value?: any): QualifiedDeclaration {
    if (!value) {
      return value
    }
    return new QualifiedDeclaration((value.signed && toBoolean(value.signed) === true), value.signerName, value.signerRole)
  }

  deserialize (input?: any): QualifiedDeclaration {
    if (input) {
      this.signerName = input.signerName
      this.signerRole = input.signerRole
    }
    return this
  }

}
