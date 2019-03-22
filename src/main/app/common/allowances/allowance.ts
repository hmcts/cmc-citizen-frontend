import { AllowanceItem } from 'common/allowances/allowanceItem'
import { MomentFactory } from 'shared/momentFactory'
import * as moment from 'moment'

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

export class Allowances {
  constructor (public allowance?: Allowance[]) {
  }

  deserialize (input?: any): Allowance {
    if (!input) {
      return input
    }
    this.allowance = this.deserializeRows(input.allowances)
    return this.allowance
      .sort((a, b) => {
        return a.startDate.diff(b.startDate, 'days')
      })
      .filter(date => date.startDate.isSameOrBefore(moment()))
      .pop()
  }

  private deserializeRows (rows: any): Allowance[] {
    let allowanceRows: Allowance[] = rows.map(row => new Allowance().deserialize(row))
    return allowanceRows
  }

}

export class Allowance {

  constructor (public personal?: AllowanceItem[],
               public dependant?: AllowanceItem[],
               public pensioner?: AllowanceItem[],
               public disability?: AllowanceItem[],
               public startDate?: moment.Moment) {
  }

  deserialize (input?: any): Allowance {
    if (!input) {
      return input
    }

    this.personal = input.personal && this.deserializeAllowanceItem(input.personal)
    this.dependant = input.dependant && this.deserializeAllowanceItem(input.dependant)
    this.pensioner = input.pensioner && this.deserializeAllowanceItem(input.pensioner)
    this.disability = input.disability && this.deserializeAllowanceItem(input.disability)
    this.startDate = MomentFactory.parse(input.startDate)

    return this
  }

  private deserializeAllowanceItem (allowanceItem: any[]): AllowanceItem[] {
    if (!allowanceItem) {
      return allowanceItem
    }
    return allowanceItem.map(allowanceItem => new AllowanceItem().deserialize(allowanceItem))
  }
}
