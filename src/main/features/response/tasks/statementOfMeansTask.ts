import { Validator } from 'class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { StatementOfMeans } from 'response/draft/statementOfMeans'

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
      && isValid(statementOfMeans.maintenance)
      && isValid(statementOfMeans.otherDependants)
      && StatementOfMeansTask.isEmploymentCompleted(statementOfMeans)
      && isValid(statementOfMeans.monthlyIncome)
      && isValid(statementOfMeans.monthlyExpenses)
      && isValid(statementOfMeans.debts)
      && isValid(statementOfMeans.courtOrders)
      && isValid(statementOfMeans.explanation)

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
}
