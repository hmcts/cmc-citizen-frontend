import { ResponseDraft } from 'response/draft/responseDraft'
import { Validator } from 'class-validator'

const validator = new Validator()

export class YourDefenceTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return !!(responseDraft.defence && validator.validateSync(responseDraft.defence).length === 0)
  }
}
