import { YesNoOption } from 'models/yesNoOption'
import { PartyType } from 'app/common/partyType'

export class Over18Defendant {

  static readonly YES = new Over18Defendant(YesNoOption.YES.option)
  static readonly NO = new Over18Defendant(YesNoOption.NO.option)
  static readonly COMPANY_OR_ORGANISATION = new Over18Defendant(PartyType.ORGANISATION.value)

  constructor (public readonly option: string) {
  }

  static fromObject (input?: any): Over18Defendant {
    if (!input) {
      return input
    }
    return this.all().filter(claimValue => claimValue.option === input).pop()
  }

  static all (): Over18Defendant[] {
    return [
      Over18Defendant.YES,
      Over18Defendant.NO,
      Over18Defendant.COMPANY_OR_ORGANISATION
    ]
  }
}
