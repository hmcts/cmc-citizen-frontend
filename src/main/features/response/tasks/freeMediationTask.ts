import { Validator } from '@hmcts/class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'

const validator = new Validator()

export class FreeMediationTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.freeMediation !== undefined && validator.validateSync(responseDraft.freeMediation).length === 0
  }
}
