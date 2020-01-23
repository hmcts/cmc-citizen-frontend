import { Validator } from '@hmcts/class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { DisabilityOption } from 'response/form/models/statement-of-means/disability'
import { CohabitingOption } from 'response/form/models/statement-of-means/cohabiting'
import { SevereDisabilityOption } from 'response/form/models/statement-of-means/severeDisability'
import { PartnerDisabilityOption } from 'response/form/models/statement-of-means/partnerDisability'
import { PartnerAgeOption } from 'response/form/models/statement-of-means/partnerAge'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class StatementOfMeansTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    const statementOfMeans: StatementOfMeans = responseDraft.statementOfMeans

    return statementOfMeans !== undefined
      && isValid(statementOfMeans.bankAccounts)
      && isValid(statementOfMeans.residence)
      && StatementOfMeansTask.isDependantsCompleted(statementOfMeans)
      && isValid(statementOfMeans.otherDependants)
      && StatementOfMeansTask.isEmploymentCompleted(statementOfMeans)
      && isValid(statementOfMeans.monthlyIncome)
      && isValid(statementOfMeans.monthlyExpenses)
      && isValid(statementOfMeans.debts)
      && isValid(statementOfMeans.courtOrders)
      && isValid(statementOfMeans.explanation)
      && StatementOfMeansTask.isDisabilityCompleted(statementOfMeans)
      && StatementOfMeansTask.isPartnerCompleted(statementOfMeans)
  }

  private static isDependantsCompleted (statementOfMeans: StatementOfMeans): boolean {
    const valid = isValid(statementOfMeans.dependants)

    if (valid && statementOfMeans.dependants.declared && statementOfMeans.dependants.numberOfChildren.between16and19 > 0) {
      return isValid(statementOfMeans.education)
    }

    return valid
  }

  private static isEmploymentCompleted (statementOfMeans: StatementOfMeans): boolean {
    if (!isValid(statementOfMeans.employment)) {
      return false
    }

    if (!statementOfMeans.employment.declared) {
      return isValid(statementOfMeans.unemployment)
    }

    let valid: boolean = true

    if (statementOfMeans.employment.employed) {
      valid = valid && isValid(statementOfMeans.employers)
    }

    if (statementOfMeans.employment.selfEmployed) {
      valid = valid && isValid(statementOfMeans.selfEmployment) && isValid(statementOfMeans.onTaxPayments)
    }

    return valid
  }

  private static isDisabilityCompleted (statementOfMeans: StatementOfMeans): boolean {
    if (!isValid(statementOfMeans.disability)) {
      return false
    }

    return statementOfMeans.disability.option === DisabilityOption.NO || isValid(statementOfMeans.severeDisability)
  }

  private static isPartnerCompleted (statementOfMeans: StatementOfMeans): boolean {
    if (!isValid(statementOfMeans.cohabiting)) {
      return false
    }

    const hasPartner: boolean = statementOfMeans.cohabiting.option === CohabitingOption.YES
    if (hasPartner) {
      if (!isValid(statementOfMeans.partnerAge)) {
        return false
      }

      const partnerIsAdult: boolean = statementOfMeans.partnerAge.option === PartnerAgeOption.YES
      if (partnerIsAdult && !isValid(statementOfMeans.partnerPension)) {
        return false
      }

      const defendantIsDisabled: boolean = statementOfMeans.disability.option === DisabilityOption.YES
      const defendantIsSeverelyDisabled: boolean = defendantIsDisabled && statementOfMeans.severeDisability === SevereDisabilityOption.YES

      if (defendantIsDisabled && !isValid(statementOfMeans.partnerDisability)) {
        return false
      }

      const partnerIsDisabled: boolean = statementOfMeans.partnerDisability.option === PartnerDisabilityOption.YES

      if (defendantIsSeverelyDisabled && partnerIsDisabled && !isValid(statementOfMeans.partnerSevereDisability)) {
        return false
      }

    }

    return true
  }

}
