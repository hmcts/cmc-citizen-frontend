import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('feature/consent')

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose your response'
}

export class FeatureConsentResponse {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
  consentResponse?: YesNoOption

  constructor (consentResponse?: YesNoOption) {
    this.consentResponse = consentResponse
  }

  static fromObject (input?: any): FeatureConsentResponse {
    if (input == null) {
      return input
    }
    logger.info('Feature Consent: ' + input.consentResponse)
    return new FeatureConsentResponse(YesNoOption.fromObject(input.consentResponse))
  }
}
