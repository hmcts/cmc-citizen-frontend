import { ResponseDraft } from 'response/draft/responseDraft'

export class MoreTimeNeededTask {
  static isCompleted (responseDraft: ResponseDraft, moreTimeRequestedAlready: boolean): boolean {
    return (!!(responseDraft.moreTimeNeeded && responseDraft.moreTimeNeeded.option) || moreTimeRequestedAlready)
  }
}
