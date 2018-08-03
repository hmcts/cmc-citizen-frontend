import { IsDefined, IsIn } from 'class-validator'
import { YesNoOption } from 'models/yesNoOption'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose your response'
}

export class FeaturePermissionResponse {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
  permissionResponse?: YesNoOption

  constructor (permissionResponse?: YesNoOption) {
    this.permissionResponse = permissionResponse
  }

  static fromObject (input?: any): FeaturePermissionResponse {
    if (input == null) {
      return input
    }
    return new FeaturePermissionResponse(YesNoOption.fromObject(input.permissionResponse))
  }
}
