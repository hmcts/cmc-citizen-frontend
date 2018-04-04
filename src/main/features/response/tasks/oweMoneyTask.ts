import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'

export class OweMoneyTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft.response || !responseDraft.response.type) {
      return false
    }

    switch (responseDraft.response.type) {
      case ResponseType.FULL_ADMISSION:
      case ResponseType.PART_ADMISSION:
        return true
      case ResponseType.DEFENCE:
        return responseDraft.rejectAllOfClaim && responseDraft.rejectAllOfClaim.option !== undefined
      default:
        throw new Error(`Unknown response type: ${responseDraft.response.type}`)
    }
  }
}
