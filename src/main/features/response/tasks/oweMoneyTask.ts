import { ResponseDraft } from 'response/draft/responseDraft'

export class OweMoneyTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft.response || (responseDraft && !responseDraft.response.type)) {
      return false
    }

    const rejectAllCompleted: boolean = responseDraft.rejectAllOfClaim && responseDraft.rejectAllOfClaim.option !== undefined
    const rejectPartCompleted: boolean = responseDraft.rejectPartOfClaim && responseDraft.rejectPartOfClaim.option !== undefined

    if (rejectAllCompleted || rejectPartCompleted) {
      return true
    } else {
      return false
    }
  }
}
