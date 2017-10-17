import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'

export class OweMoneyTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft.response || !responseDraft.response.type) {
      return false
    }

    switch (responseDraft.response.type) {
      case ResponseType.OWE_ALL_PAID_NONE:
        return true
      case ResponseType.OWE_SOME_PAID_NONE:
        return responseDraft.rejectPartOfClaim && responseDraft.rejectPartOfClaim.option !== undefined
      case ResponseType.OWE_NONE:
        return responseDraft.rejectAllOfClaim && responseDraft.rejectAllOfClaim.option !== undefined
      default:
        throw new Error(`Unknown response type: ${responseDraft.response.type}`)
    }
  }
}
