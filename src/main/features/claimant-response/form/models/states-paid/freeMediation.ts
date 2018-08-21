import { IsDefined, IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

export class FreeMediation {

  @IsDefined({ message: ValidationErrors.YES_NO_REQUIRED })
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED })
  freeMediation?: YesNoOption

  constructor (freeMediation?: YesNoOption) {
    this.freeMediation = freeMediation
  }

  static fromObject (input?: any): FreeMediation {
    if (input == null) {
      return input
    }

    return new FreeMediation(YesNoOption.fromObject(input.freeMediation))
  }

  deserialize (input?: any): FreeMediation {
    if (input && input.freeMediation) {
      this.freeMediation = YesNoOption.fromObject(input.freeMediation.option)
    }

    return this
  }
}
