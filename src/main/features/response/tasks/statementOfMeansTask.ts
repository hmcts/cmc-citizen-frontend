import { Validator } from 'class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { StatementOfMeans } from 'response/draft/statementOfMeans'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class StatementOfMeansTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return isValid(responseDraft.fullAdmission.paymentOption)
      && this.statementOfMeansIsCompletedIfApplicable(responseDraft)
  }

  private static statementOfMeansIsCompletedIfApplicable (responseDraft: ResponseDraft): boolean {
    if (StatementOfMeans.isApplicableFor(responseDraft)) {
      const statementOfMeans: StatementOfMeans = responseDraft.statementOfMeans

      return statementOfMeans !== undefined
        && isValid(statementOfMeans.residence)
        && StatementOfMeansTask.isDependantsCompleted(statementOfMeans)
        && StatementOfMeansTask.isEmploymentCompleted(statementOfMeans)
        && isValid(statementOfMeans.bankAccounts)
        && isValid(statementOfMeans.debts)
        && isValid(statementOfMeans.monthlyIncome)
        && isValid(statementOfMeans.monthlyExpenses)
        && isValid(statementOfMeans.courtOrders)
        && isValid(statementOfMeans.explanation)
    }

    return true
  }

  private static isDependantsCompleted (statementOfMeans: StatementOfMeans): boolean {
    const dependantValid = isValid(statementOfMeans.dependants)

    if (!dependantValid) {
      return false
    }

    if (statementOfMeans.dependants.hasAnyChildren && statementOfMeans.dependants.numberOfChildren.between16and19 > 0) {
      return isValid(statementOfMeans.education)
        && isValid(statementOfMeans.maintenance)
        && isValid(statementOfMeans.supportedByYou)
    }

    return isValid(statementOfMeans.maintenance) && isValid(statementOfMeans.supportedByYou)
  }

  private static isEmploymentCompleted (som: StatementOfMeans): boolean {
    const employmentValid = isValid(som.employment)

    if (!employmentValid) {
      return false
    }

    if (!som.employment.isCurrentlyEmployed) {
      return isValid(som.unemployed)
    }

    let result: boolean = true

    if (som.employment.selfEmployed) {
      result = result && isValid(som.selfEmployed)
    }

    if (som.employment.employed) {
      result = result && isValid(som.employers)
    }

    return result
  }
}
