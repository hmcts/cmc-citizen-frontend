import { IsDefined, ValidateIf } from '@hmcts/class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { SignatureType } from 'common/signatureType'

export class ValidationErrors {
  static readonly STATEMENT_OF_TRUTH_REQUIRED_MESSAGE: string = 'Please select I believe that the facts stated in this response are true'
  static readonly DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE: string = 'The hearing requirement details on this page are true to the best of my knowledge.'
}

export class StatementOfTruth {
  type: string

  @IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  signed?: boolean

  @ValidateIf(o => o.type === SignatureType.DIRECTION_QUESTIONNAIRE)
  @IsDefined({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
  directionsQuestionnaireSigned?: boolean

  constructor (type?: string, signed?: boolean, directionsQuestionnaireSigned?: boolean) {
    if (type) {
      this.type = type
    } else {
      this.type = SignatureType.BASIC
    }
    this.signed = signed
    if (directionsQuestionnaireSigned) {
      this.directionsQuestionnaireSigned = directionsQuestionnaireSigned
    }
  }

  static fromObject (input: any) : StatementOfTruth {
    if (!input) {
      return input
    }

    if (input && input.type === SignatureType.BASIC) {
      return new StatementOfTruth(SignatureType.BASIC, input && input.signed === 'true')
    } else if (input && input.type === SignatureType.DIRECTION_QUESTIONNAIRE) {
      return new StatementOfTruth(SignatureType.DIRECTION_QUESTIONNAIRE, input && input.signed === 'true', input && input.directionsQuestionnaireSigned === 'true')
    }
  }
}
