import { AllowanceItem } from 'common/allowances/allowanceItem'

export enum DependantAllowanceType {
  PER_DEPENDANT = 'EACH'
}
export enum DisabilityAllowanceType {
  DEFENDANT_ONLY = 'DEFENDANT_ONLY',
  DEFENDANT_ONLY_SEVERE = 'DEFENDANT_ONLY_SEVERE',
  DEFENDANT_AND_PARTNER = 'DEFENDANT_AND_PARTNER',
  DEFENDANT_AND_PARTNER_SEVERE = 'DEFENDANT_AND_PARTNER_SEVERE',
  DEPENDANT = 'DEPENDANT',
  CARER = 'CARER'
}
export enum PensionAllowanceType {
  DEFENDANT_ONLY = 'DEFENDANT_ONLY',
  DEFENDANT_AND_PARTNER = 'DEFENDANT_AND_PARTNER'
}

export enum LivingAllowanceType {
  SINGLE_18_TO_24 = 'SINGLE_18_TO_24',
  SINGLE_OVER_25 = 'SINGLE_OVER_25',
  DEFENDANT_AND_PARTNER_OVER_18 = 'DEFENDANT_AND_PARTNER_OVER_18',
  DEFENDANT_UNDER_25_PARTNER_UNDER_18 = 'DEFENDANT_UNDER_25_PARTNER_UNDER_18',
  DEFENDANT_OVER_25_PARTNER_UNDER_18 = 'DEFENDANT_OVER_25_PARTNER_UNDER_18'
}

export class Allowance {

  constructor (public personal?: AllowanceItem[],
               public dependant?: AllowanceItem[],
               public pensioner?: AllowanceItem[],
               public disability?: AllowanceItem[]) {
  }

  deserialize (input?: any): Allowance {
    if (!input) {
      return input
    }
    this.personal = input.personal && this.deserializeAllowanceItem(input.personal)
    this.dependant = input.dependant && this.deserializeAllowanceItem(input.dependant)
    this.pensioner = input.pensioner && this.deserializeAllowanceItem(input.pensioner)
    this.disability = input.disability && this.deserializeAllowanceItem(input.disability)

    return this
  }

  private deserializeAllowanceItem (allowanceItem: any[]): AllowanceItem[] {
    if (!allowanceItem) {
      return allowanceItem
    }
    return allowanceItem.map(allowanceItem => new AllowanceItem().deserialize(allowanceItem))
  }
}
