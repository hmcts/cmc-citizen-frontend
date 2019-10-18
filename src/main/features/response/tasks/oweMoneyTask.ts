import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'
import { Validator } from '@hmcts/class-validator'

const validator = new Validator()

export class OweMoneyTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft.response || !responseDraft.response.type) {
      return false
    }

    switch (responseDraft.response.type) {
      case ResponseType.FULL_ADMISSION:
        return true
      case ResponseType.PART_ADMISSION:
        return !!responseDraft.partialAdmission && this.isValid(responseDraft.partialAdmission.alreadyPaid)
      case ResponseType.DEFENCE:
        return OweMoneyTask.isValid(responseDraft.rejectAllOfClaim)
      default:
        throw new Error(`Unknown response type: ${responseDraft.response.type}`)
    }
  }

  private static isValid (model): boolean {
    return model !== undefined && validator.validateSync(model).length === 0
  }
}
