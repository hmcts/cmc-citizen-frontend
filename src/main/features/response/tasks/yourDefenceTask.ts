import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from '@hmcts/class-validator'

const validator = new Validator()

export class YourDefenceTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return !!responseDraft.defence
      && YourDefenceTask.isSectionValid(responseDraft.defence)
      && YourDefenceTask.isSectionValid(responseDraft.timeline)
  }

  private static isSectionValid (section): boolean {
    return !!section && validator.validateSync(section).length === 0
  }
}
