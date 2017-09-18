import { IsDefined, MaxLength } from 'class-validator'
import { IsBooleanTrue } from 'forms/validation/validators/isBooleanTrue'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
export class ValidationErrors {
  static readonly STATEMENT_OF_TRUTH_REQUIRED_MESSAGE: string = 'Please select I believe that the facts stated in this claim are true.'
  static readonly SIGNER_NAME_REQUIRED: string = 'Enter Signers name'
  static readonly SIGNER_NAME_TOO_LONG: string = 'Signers name must be no longer than $constraint1 characters'
  static readonly SIGNER_ROLE_REQUIRED: string = 'Enter Signers role'
  static readonly SIGNER_ROLE_TOO_LONG: string = 'Signers role must be no longer than $constraint1 characters'
}

export default class StatementOfTruth {
  @IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  signed?: boolean

  @IsDefined({ message: ValidationErrors.SIGNER_NAME_REQUIRED, groups: ['claimant'] })
  @IsNotBlank({ message: ValidationErrors.SIGNER_NAME_REQUIRED, groups: ['claimant'] })
  @MaxLength(70, { message: ValidationErrors.SIGNER_NAME_TOO_LONG, groups: ['claimant'] })
  signerName?: string

  @IsDefined({ message: ValidationErrors.SIGNER_ROLE_REQUIRED, groups: ['claimant'] })
  @IsNotBlank({ message: ValidationErrors.SIGNER_ROLE_REQUIRED, groups: ['claimant'] })
  @MaxLength(255, { message: ValidationErrors.SIGNER_ROLE_TOO_LONG, groups: ['claimant'] })
  signerRole?: string

  constructor (signed?: boolean, signerName?: string, signerRole?: string ) {
    this.signed = signed
    this.signerName = signerName
    this.signerRole = signerRole
  }

  static fromObject (value?: any): StatementOfTruth {
    if (!value) {
      return value
    }
    return new StatementOfTruth(value.signed === 'true', value.signerName, value.signerRole )
  }

  deserialize (input?: any): StatementOfTruth {
    if (input) {
      this.signerName = input.signerName
      this.signerRole = input.signerRole
    }
    return this
  }
}
