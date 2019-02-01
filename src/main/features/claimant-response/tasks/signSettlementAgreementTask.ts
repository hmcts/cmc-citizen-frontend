import { Validator } from '@hmcts/class-validator'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'

const validator = new Validator()

export class SignSettlementAgreementTask {
  static isCompleted (value: SettlementAgreement): boolean {
    return value !== undefined && validator.validateSync(value).length === 0
  }
}
