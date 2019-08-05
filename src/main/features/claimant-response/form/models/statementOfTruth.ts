import { IsDefined, ValidateIf } from '@hmcts/class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { SignatureType } from 'common/signatureType'

export class ValidationErrors {
  static readonly DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE: string = 'The hearing requirement details on this page are true to the best of my knowledge.'
}

export class StatementOfTruth {
  type: string

  @ValidateIf(o => o.type === SignatureType.DIRECTION_QUESTIONNAIRE)
  @IsDefined({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
  directionsQuestionnaireSigned?: boolean

  constructor (type?: string, directionsQuestionnaireSigned?: boolean) {
    if (type) {
      this.type = type
    } else {
      this.type = SignatureType.BASIC
    }
    if (directionsQuestionnaireSigned !== undefined) {
      this.directionsQuestionnaireSigned = directionsQuestionnaireSigned
    }
  }

  static fromObject (input: any): StatementOfTruth {

    if (input && input.type === SignatureType.DIRECTION_QUESTIONNAIRE) {
      return new StatementOfTruth(SignatureType.DIRECTION_QUESTIONNAIRE,input.directionsQuestionnaireSigned === 'true')
    } else {
      return new StatementOfTruth()
    }
  }
}
