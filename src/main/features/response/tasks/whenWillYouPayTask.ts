import { Validator } from 'class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { PayBySetDate } from 'response/draft/payBySetDate'
import { StatementOfMeans } from 'response/draft/statementOfMeans'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class WhenWillYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return isValid(responseDraft.defendantPaymentOption)
      && this.paymentDetailsAreProvidedFor(responseDraft)
      && this.statementOfMeansIsCompletedIfApplicable(responseDraft)
  }

  private static paymentDetailsAreProvidedFor (responseDraft: ResponseDraft): boolean {
    if (responseDraft.defendantPaymentOption.option === DefendantPaymentType.BY_SET_DATE) {
      return responseDraft.payBySetDate !== undefined
        && isValid(responseDraft.payBySetDate.paymentDate)
        && this.explanationIsValidIfRequired(responseDraft.payBySetDate)
    } else if (responseDraft.defendantPaymentOption.option === DefendantPaymentType.INSTALMENTS) {
      return isValid(responseDraft.defendantPaymentPlan)
    } else {
      throw new Error(`Unknown payment option: ${responseDraft.defendantPaymentOption.option}`)
    }
  }

  private static explanationIsValidIfRequired (payBySetDate: PayBySetDate): boolean {
    if (payBySetDate.requiresExplanation()) {
      return isValid(payBySetDate.explanation)
    } else {
      return true
    }
  }

  private static statementOfMeansIsCompletedIfApplicable (responseDraft: ResponseDraft): boolean {
    if (StatementOfMeans.isApplicableFor(responseDraft)) {
      const statementOfMeans: StatementOfMeans = responseDraft.statementOfMeans

      return statementOfMeans !== undefined
        && isValid(statementOfMeans.residence)
        && WhenWillYouPayTask.isDependantsCompleted(statementOfMeans)
        && WhenWillYouPayTask.isEmploymentCompleted(statementOfMeans)
        && isValid(statementOfMeans.bankAccounts)
        && isValid(statementOfMeans.debts)
        && isValid(statementOfMeans.monthlyIncome)
        && isValid(statementOfMeans.monthlyExpenses)
        && isValid(statementOfMeans.courtOrders)
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
