import { AllowanceItem } from 'common/allowances/allowanceItem'
import {
  Allowance, Allowances,
  DependantAllowanceType,
  DisabilityAllowanceType,
  LivingAllowanceType,
  PensionAllowanceType
} from 'common/allowances/allowance'
import { join } from 'path'

export interface AllowanceRepository {

  getDependantAllowance (dependantAllowanceType: DependantAllowanceType): AllowanceItem
  getDisabilityAllowance (disabilityAllowanceType: DisabilityAllowanceType): AllowanceItem
  getLivingAllowance (livingAllowanceType: LivingAllowanceType): AllowanceItem
  getPensionAllowance (pensionAllowanceType: PensionAllowanceType): AllowanceItem

}

export class ResourceAllowanceRepository implements AllowanceRepository {

  private allowances: Allowance

  constructor (public path?: string) {
    const resourcePath = path || join(__dirname, '..', '..', '..','resources','meansAllowance.json')
    this.allowances = new Allowances().deserialize(require(resourcePath))
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
