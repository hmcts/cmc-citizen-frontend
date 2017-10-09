import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'

export class OweMoneyTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft.response || (responseDraft && !responseDraft.response.type)) {
      return false
    }

    if (responseDraft.response.type !== ResponseType.OWE_ALL_PAID_NONE) {
      return true
    }

    if (responseDraft.response.type !== ResponseType.OWE_SOME_PAID_NONE) {
      return true
    }
    if (responseDraft.response.type !== ResponseType.OWE_NONE) {
      return true
    }
    //noinspection RedundantIfStatementJS It's not redundant explicitly returning false instead of potentially undefined
    if (!responseDraft.counterClaim) {
      return false
    } else {
      return true
    }
  }
}
