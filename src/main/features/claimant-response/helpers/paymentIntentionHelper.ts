import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { MomentFactory } from 'shared/momentFactory'
import * as _ from 'lodash'
import { Frequency } from 'common/frequency/frequency'
import { PaymentOption } from 'claims/models/paymentOption'

export class PaymentIntentionHelper {

  static getDefendantPaymentIntention (claim: Claim): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse
      = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    return claimResponse.paymentIntention
  }

  static getClaimantPaymentIntention (draft: DraftClaimantResponse): PaymentIntention {
    return draft.alternatePaymentMethod.toDomainInstance()
  }

  static getCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim): PaymentIntention {
    const courtCalculatedPaymentIntention = new PaymentIntention()
    const paymentPlanFromDefendantFinancialStatement: PaymentPlan
      = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)

    if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
      if (paymentPlanFromDefendantFinancialStatement.startDate.isSame(MomentFactory.maxDate())) {
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
        courtCalculatedPaymentIntention.paymentDate = MomentFactory.maxDate()
      } else {
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanFromDefendantFinancialStatement.startDate,
          instalmentAmount: _.round(paymentPlanFromDefendantFinancialStatement.instalmentAmount, 2),
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency),
          completionDate: paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate(),
          paymentLength: paymentPlanFromDefendantFinancialStatement.calculatePaymentLength()
        }
      }
    }

    if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE
      || draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
      courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      courtCalculatedPaymentIntention.paymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
    }
    return courtCalculatedPaymentIntention
  }
}
