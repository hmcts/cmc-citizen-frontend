import { FullAdmissionResponse } from 'main/app/claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'main/app/claims/models/response/partialAdmissionResponse'
import { Claim } from 'main/app/claims/models/claim'
import { DraftClaimantResponse } from 'main/features/claimant-response/draft/draftClaimantResponse'
import { PaymentPlan } from 'main/app/common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'main/common/helpers/paymentPlanHelper'
import { MomentFactory } from 'main/common/momentFactory'
import * as _ from 'lodash'
import { Frequency } from 'main/app/common/frequency/frequency'
import { PaymentOption } from 'main/app/claims/models/paymentOption'
import { PaymentIntention, PaymentIntentionBuilder } from 'shared/models/paymentIntention'
import { RepaymentPlan } from 'claims/models/repaymentPlan'

export class PaymentIntentionHelper {

  static getDefendantPaymentIntention(claim: Claim): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse
      = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    return PaymentIntention.convertFromCorePaymentIntention(claimResponse.paymentIntention)
  }

  static getClaimantPaymentIntention(draft: DraftClaimantResponse): PaymentIntention {
    return PaymentIntention.convertFromCorePaymentIntention(draft.alternatePaymentMethod.toDomainInstance())
  }

  static getCourtCalculatedPaymentIntention(draft: DraftClaimantResponse, claim: Claim): PaymentIntention {
    const paymentPlanFromDefendantFinancialStatement: PaymentPlan
      = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)

    switch (draft.alternatePaymentMethod.paymentOption.option.value) {
      case PaymentOption.INSTALMENTS:
        if (paymentPlanFromDefendantFinancialStatement.startDate.isSame(MomentFactory.maxDate())) {
          return new PaymentIntentionBuilder(PaymentOption.BY_SPECIFIED_DATE)
            .setPaymentDate(MomentFactory.maxDate())
            .build()
        } else {
          return new PaymentIntentionBuilder(PaymentOption.INSTALMENTS)
            .setRepaymentPlan(new RepaymentPlan(
              _.round(paymentPlanFromDefendantFinancialStatement.instalmentAmount, 2),
              paymentPlanFromDefendantFinancialStatement.startDate,
              Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency),
              paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate(),
              paymentPlanFromDefendantFinancialStatement.calculatePaymentLength()
            ))
            .build()
        }
      case PaymentOption.IMMEDIATELY:
      case PaymentOption.BY_SPECIFIED_DATE:
        return new PaymentIntentionBuilder(PaymentOption.BY_SPECIFIED_DATE)
          .setPaymentDate(paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate())
          .build()
      default:
        return undefined
    }
  }
}
