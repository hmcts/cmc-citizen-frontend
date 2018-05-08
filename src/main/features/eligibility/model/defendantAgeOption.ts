import { YesNoOption } from 'models/yesNoOption'
import { PartyType } from 'common/partyType'

export class DefendantAgeOption {

  static readonly YES = new DefendantAgeOption(YesNoOption.YES.option)
  static readonly NO = new DefendantAgeOption(YesNoOption.NO.option)
  static readonly COMPANY_OR_ORGANISATION = new DefendantAgeOption(PartyType.ORGANISATION.value)

  constructor (public readonly option: string) {
  }

  static fromObject (input?: any): DefendantAgeOption {
    if (!input) {
      return input
    }
    return this.all().filter(defendantAgeOption => defendantAgeOption.option === input).pop()
  }

  static all (): DefendantAgeOption[] {
    return [
      DefendantAgeOption.YES,
      DefendantAgeOption.NO,
      DefendantAgeOption.COMPANY_OR_ORGANISATION
    ]
  }
}
