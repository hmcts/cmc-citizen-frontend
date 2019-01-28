import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { FreeMediation } from 'forms/models/freeMediation'

export class FreeMediationUtil {
  static convertFreeMediation (freeMediation: FreeMediation): YesNoOption {
    if (!freeMediation || !freeMediation.option) {
      return YesNoOption.NO
    } else {
      return freeMediation.option as YesNoOption
    }
  }
}
