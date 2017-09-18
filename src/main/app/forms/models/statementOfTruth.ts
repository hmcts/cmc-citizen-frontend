import { IsDefined } from 'class-validator'
import { IsBooleanTrue } from 'forms/validation/validators/isBooleanTrue'
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

  constructor (signed?: boolean
  ) {
    this.signed = signed
  }

  static fromObject (value?: any): StatementOfTruth {
    if (!value) {
      return value
    }
    return new StatementOfTruth(value.signed === 'true')
  }
}
