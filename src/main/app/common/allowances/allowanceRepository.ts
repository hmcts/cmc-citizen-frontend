import { AllowanceItem } from 'common/allowances/allowanceItem'
import { Allowance } from 'common/allowances/allowance'
import { join } from 'path'

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

export interface AllowanceRepository {

  getDependantAllowance (dependantAllowanceType: DependantAllowanceType): AllowanceItem
  getDisabilityAllowance (disabilityAllowanceType: DisabilityAllowanceType): AllowanceItem
  getLivingAllowance (livingAllowanceType: LivingAllowanceType): AllowanceItem
  getPensionAllowance (pensionAllowanceType: PensionAllowanceType): AllowanceItem

}

export class ResourceAllowanceRepository implements AllowanceRepository {

  private allowances: Allowance

  constructor (public option?: string) {
    let meansAllowance = option
    if (!meansAllowance) {
      meansAllowance = join(__dirname, '..', '..', '..','resources','meansAllowance.json')
    }
    this.allowances = new Allowance().deserialize(require(meansAllowance))
  }

  getDependantAllowance (dependantAllowanceType: DependantAllowanceType): AllowanceItem {
    return this.allowances.dependant ?
      this.getMonthlyAllowanceAmount(this.allowances.dependant, dependantAllowanceType) : undefined
  }

  getDisabilityAllowance (disabilityAllowanceType: DisabilityAllowanceType): AllowanceItem {
    return this.allowances.disability ?
      this.getMonthlyAllowanceAmount(this.allowances.disability, disabilityAllowanceType) : undefined
  }

  getLivingAllowance (livingAllowanceType: LivingAllowanceType): AllowanceItem {
    return this.allowances.personal ?
      this.getMonthlyAllowanceAmount(this.allowances.personal, livingAllowanceType) : undefined
  }

  getPensionAllowance (pensionAllowanceType: PensionAllowanceType): AllowanceItem {
    return this.allowances.pensioner ?
      this.getMonthlyAllowanceAmount(this.allowances.pensioner, pensionAllowanceType) : undefined
  }

  private getMonthlyAllowanceAmount (searchArray: AllowanceItem[], filterOption: string): AllowanceItem {
    return searchArray.filter(category => category.item === filterOption).pop()
  }
}
