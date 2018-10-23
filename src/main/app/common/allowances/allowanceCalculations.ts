import { Partner } from 'claims/models/response/statement-of-means/partner'
import { AllowanceRepository } from 'common/allowances/allowanceRepository'
import { AgeGroupType, Child, Dependant } from 'claims/models/response/statement-of-means/dependant'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { Income, IncomeType } from 'claims/models/response/statement-of-means/income'
import { DependantAllowanceType,
  DisabilityAllowanceType,
  LivingAllowanceType,
  PensionAllowanceType } from 'common/allowances/allowance'
import { AllowanceItem } from 'common/allowances/allowanceItem'

export class AllowanceCalculations {

  constructor (private allowances?: AllowanceRepository) {}

  getMonthlyPensionerAllowance (income: Income[], partner: Partner): number {
    if (!income) {
      return 0
    }
    const isDefendantPensioner = income.filter(incomeType => incomeType.type === IncomeType.PENSION).pop() !== undefined
    if (isDefendantPensioner) {
      if (partner && partner.pensioner) {
        return this.getMonthlyAmount(this.allowances.getPensionAllowance(PensionAllowanceType.DEFENDANT_AND_PARTNER))
      } else {
        return this.getMonthlyAmount(this.allowances.getPensionAllowance(PensionAllowanceType.DEFENDANT_ONLY))
      }
    }
    return 0
  }

  getMonthlyDependantsAllowance (dependants: Dependant): number {
    if (!dependants) {
      return 0
    }
    let numberOfDependants = 0
    if (dependants.children) {
      const reducer = (total: number, children: Child) => {
        const numberOfDependants: number =
          children.ageGroupType !== AgeGroupType.BETWEEN_16_AND_19 ?
            children.numberOfChildren : children.numberOfChildrenLivingWithYou

        if (!numberOfDependants) {
          return total
        }
        return total + numberOfDependants
      }
      numberOfDependants = dependants.children.reduce(reducer, 0)
    }

    if (dependants.otherDependants) {
      numberOfDependants += dependants.otherDependants.numberOfPeople
    }
    const monthlyAmount: number = this.getMonthlyAmount(this.allowances.getDependantAllowance(DependantAllowanceType.PER_DEPENDANT))
    return (numberOfDependants * monthlyAmount)
  }

  getMonthlyLivingAllowance (defendantAge: number, partner: Partner): number {
    if (defendantAge < 18 || defendantAge === undefined) {
      return 0
    }
    let cohabitationStatus: LivingAllowanceType
    if (!partner) {
      cohabitationStatus = defendantAge < 25 ? LivingAllowanceType.SINGLE_18_TO_24 : LivingAllowanceType.SINGLE_OVER_25
    } else {
      if (partner.over18) {
        cohabitationStatus = LivingAllowanceType.DEFENDANT_AND_PARTNER_OVER_18
      } else {
        cohabitationStatus = defendantAge < 25 ? LivingAllowanceType.DEFENDANT_UNDER_25_PARTNER_UNDER_18 :
          LivingAllowanceType.DEFENDANT_OVER_25_PARTNER_UNDER_18
      }
    }
    return this.getMonthlyAmount(this.allowances.getLivingAllowance(cohabitationStatus))
  }

  getCarerDisableDependantAmount (dependant: Dependant, isCarer: boolean): number {
    const disabledDependantAmount: number = this.getDisabledDependantAmount(dependant)
    const carerAmount: number = this.getCarerAmount(isCarer)
    return disabledDependantAmount > carerAmount ? disabledDependantAmount : carerAmount
  }

  getDisabilityAllowance (defendantDisability: DisabilityStatus, partner: Partner): number {

    if (defendantDisability === DisabilityStatus.NO) {
      return 0
    }

    let disabledStatus: DisabilityAllowanceType = defendantDisability === DisabilityStatus.YES ?
      DisabilityAllowanceType.DEFENDANT_ONLY : DisabilityAllowanceType.DEFENDANT_ONLY_SEVERE

    if (partner && partner.disability) {
      switch (partner.disability) {
        case DisabilityStatus.YES:
          disabledStatus = defendantDisability === DisabilityStatus.YES ?
            DisabilityAllowanceType.DEFENDANT_AND_PARTNER : DisabilityAllowanceType.DEFENDANT_ONLY_SEVERE
          break
        case DisabilityStatus.SEVERE:
          disabledStatus = defendantDisability === DisabilityStatus.YES ?
            DisabilityAllowanceType.DEFENDANT_ONLY_SEVERE : DisabilityAllowanceType.DEFENDANT_AND_PARTNER_SEVERE
          break
        default:
          break
      }
    }
    return this.getMonthlyAmount(this.allowances.getDisabilityAllowance(disabledStatus))
  }

  private getDisabledDependantAmount (dependant: Dependant): number {
    if (dependant) {
      if (dependant.anyDisabledChildren) {
        return this.allowances.getDisabilityAllowance(DisabilityAllowanceType.DEPENDANT).monthly || 0
      }
      if (dependant.otherDependants) {
        if (dependant.otherDependants.anyDisabled) {
          return this.allowances.getDisabilityAllowance(DisabilityAllowanceType.DEPENDANT).monthly || 0
        }
      }
    }
  }

  private getCarerAmount (isCarer: boolean): number {
    return isCarer ? this.allowances.getDisabilityAllowance(DisabilityAllowanceType.CARER).monthly : 0
  }

  private getMonthlyAmount (allowanceItem: AllowanceItem): number {
    if (!allowanceItem || !allowanceItem.monthly) {
      return 0
    }
    return allowanceItem.monthly
  }

}
