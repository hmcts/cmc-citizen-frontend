import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import * as _ from 'lodash'
import * as path from 'path'
import { PaymentOption } from 'claims/models/paymentOption'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { MomentFactory } from 'shared/momentFactory'
import { isPastDeadline } from 'claims/isPastDeadline'
import { StatementType } from 'offer/form/models/statementType'
import { FullAdmissionStates } from 'claims/models/claim-states/full-admission-states'

export function FullAdmissionTransitions (claim: Claim) {
  return new StateMachine({
    init: 'full-admission',
    transitions: [
      {
        name: 'checkIsPayImmediately',
        from: FullAdmissionStates.FULL_ADMISSION,
        to: FullAdmissionStates.FA_PAY_IMMEDIATELY
      },
      {
        name: 'checkIsPayImmediatelyPastDeadLine',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IMMEDIATELY],
        to: FullAdmissionStates.FA_PAY_IMMEDIATELY_PAST_DEADLINE
      },
      {
        name: 'checkCCJRequestedPayImmediatelyPastDeadLine',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IMMEDIATELY_PAST_DEADLINE],
        to: FullAdmissionStates.FA_CCJ_PAST_PAYMENT_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkIsClaimSettled',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IMMEDIATELY],
        to: FullAdmissionStates.FA_SETTLED_PAID_IN_FULL
      },

      {
        name: 'checkIsBySpecifiedDate',
        from: FullAdmissionStates.FULL_ADMISSION,
        to: FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE
      },
      {
        name: 'checkIsInstalments',
        from: FullAdmissionStates.FULL_ADMISSION,
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS
      },

      {
        name: 'checkIsPayBySpecifiedDateReferredToJudge',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE],
        to: FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE_REFERRED_TO_JUDGE
      },
      {
        name: 'checkIsPayInInstalmentsReferredToJudge',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_REFERRED_TO_JUDGE
      },

      {
        name: 'checkCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_BY_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_BY_ADMISSION
      },
      {
        name: 'checkPayBySetDateClaimantOfferAcceptedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsClaimantOfferAcceptedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION
      },
      {
        name: 'checkPayBySetDatePastCounterSignatureDeadlineByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsPastCounterSignatureDeadlineByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkPayBySetDateDefendantOfferRejectedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsDefendantOfferRejectedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJPayBySetDateRequestedDefendantOfferRejectedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedDefendantOfferRejectedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastCounterSignatureDeadlineByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkIsPayBySetDateSettledThroughAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkIsPayInInstalmentsSettledThroughAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkPayBySetDatePastPaymentDeadLineDuringSettlementByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_SETTLED_THROUGH_ADMISSION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsPastPaymentDeadLineDuringSettlementByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_ADMISSION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastPaymentDeadLineDuringSettlementByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastPaymentDeadLineDuringSettlementByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },

      {
        name: 'checkPayBySetDateClaimantOfferAcceptedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsClaimantOfferAcceptedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_BY_DETERMINATION
      },
      {
        name: 'checkPayBySetDatePastCounterSignatureDeadlineByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsPastCounterSignatureDeadlineByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkPayBySetDateDefendantOfferRejectedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsDefendantOfferRejectedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedDefendantOfferRejectedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedDefendantOfferRejectedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastCounterSignatureDeadlineByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkIsPayBySetDateSettledThroughDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkIsPayInInstalmentsSettledThroughDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkPayBySetDatePastPaymentDeadLineDuringSettlementByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_SETTLED_THROUGH_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsPastPaymentDeadLineDuringSettlementByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_DETERMINATION],
        to: FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastPaymentDeadLineDuringSettlementByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastPaymentDeadLineDuringSettlementByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      }

    ],
    data: {
      paymentOption: (claim.response as FullAdmissionResponse).paymentIntention.paymentOption,
      log: {
        invalidTransitions: []
      }
    },
    methods: {
      checkCCJRequested (): boolean {
        return !!claim.countyCourtJudgmentRequestedAt
      },

      onInvalidTransition (transition: string, from: string, to: string): void {
        this.log.invalidTransitions.push({ transition: transition, from: from, to: to })
      },

      onBeforeCheckIsPayImmediately (): boolean {
        return this.paymentOption === PaymentOption.IMMEDIATELY
      },

      onBeforeCheckIsPayImmediatelyPastDeadLine (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IMMEDIATELY) && !claim.claimantResponse &&
          (claim.response as FullAdmissionResponse).paymentIntention.paymentDate.isBefore(MomentFactory.currentDateTime())
      },

      checkPastCounterSignatureDeadline (): boolean {
        return !claim.settlement.isSettled() && !!claim.claimantRespondedAt && claim.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
      },

      onBeforeCheckPayBySetDatePastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !this.checkDefendantOfferRejected() && this.checkClaimantOfferAcceptedByAdmission() && this.checkPastCounterSignatureDeadline()
      },

      onBeforeCheckPayInInstalmentsPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !this.checkDefendantOfferRejected() && this.checkClaimantOfferAcceptedByAdmission() && this.checkPastCounterSignatureDeadline()
      },

      onBeforeCheckPayBySetDatePastCounterSignatureDeadlineByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && !this.checkDefendantOfferRejected() && this.checkClaimantOfferAcceptedByDetermination() && this.checkPastCounterSignatureDeadline()
      },

      onBeforeCheckPayInInstalmentsPastCounterSignatureDeadlineByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && !this.checkDefendantOfferRejected() && this.checkClaimantOfferAcceptedByDetermination() && this.checkPastCounterSignatureDeadline()
      },

      onBeforeCheckCCJRequestedPayImmediatelyPastDeadLine (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IMMEDIATELY_PAST_DEADLINE) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedPastCounterSignatureDeadlineByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedDefendantOfferRejectedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedDefendantOfferRejectedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedDefendantOfferRejectedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedDefendantOfferRejectedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION) && this.checkCCJRequested()
      },

      checkCCJRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return !!claim.countyCourtJudgmentRequestedAt && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
          (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      },

      onBeforeCheckCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE) && this.checkCCJRequestedWhenAcceptRepaymentPlanByAdmission()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS) && this.checkCCJRequestedWhenAcceptRepaymentPlanByAdmission()

      },

      checkCCJRequestedWhenAcceptRepaymentPlanByDetermination (): boolean {
        return !!claim.countyCourtJudgmentRequestedAt && !!(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
          (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      },

      onBeforeCheckCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE) && this.checkCCJRequestedWhenAcceptRepaymentPlanByDetermination()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS) && this.checkCCJRequestedWhenAcceptRepaymentPlanByDetermination()

      },

      onBeforeCheckIsBySpecifiedDate (): boolean {
        return this.paymentOption === PaymentOption.BY_SPECIFIED_DATE
      },

      onBeforeCheckIsInstalments (): boolean {
        return this.paymentOption === PaymentOption.INSTALMENTS
      },

      checkIsReferredToJudge (): boolean {
        return !!claim.claimantResponse && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE
      },

      onBeforeCheckIsPayBySpecifiedDateReferredToJudge (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE) && this.checkIsReferredToJudge()
      },

      onBeforeCheckIsPayInInstalmentsReferredToJudge (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS) && this.checkIsReferredToJudge()
      },

      checkClaimantOfferAcceptedByAdmission (): boolean {
        return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
          !!claim.claimantResponse && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      },

      onBeforeCheckPayBySetDateClaimantOfferAcceptedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE) && this.checkClaimantOfferAcceptedByAdmission()
      },

      onBeforeCheckPayInInstalmentsClaimantOfferAcceptedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS) && this.checkClaimantOfferAcceptedByAdmission()
      },

      checkClaimantOfferAcceptedByDetermination (): boolean {
        return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
          !!claim.claimantResponse && !!(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      },

      onBeforeCheckPayBySetDateClaimantOfferAcceptedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE) && this.checkClaimantOfferAcceptedByDetermination()
      },

      onBeforeCheckPayInInstalmentsClaimantOfferAcceptedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS) && this.checkClaimantOfferAcceptedByDetermination()
      },

      checkIsSettled (): boolean {
        return !!claim.settlement && claim.settlement.isThroughAdmissionsAndSettled()
      },

      onBeforeCheckIsPayBySetDateSettledThroughAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && this.checkIsSettled()
      },

      onBeforeCheckIsPayInInstalmentsSettledThroughAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && this.checkIsSettled()
      },

      onBeforeCheckIsPayBySetDateSettledThroughDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && this.checkIsSettled()
      },

      onBeforeCheckIsPayInInstalmentsSettledThroughDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && this.checkIsSettled()
      },

      checkDefendantOfferRejected (): boolean {
        return (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
          && claim.settlement && claim.settlement.isOfferRejected()
      },

      onBeforeCheckPayBySetDateDefendantOfferRejectedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && this.checkDefendantOfferRejected()
      },

      onBeforeCheckPayInInstalmentsDefendantOfferRejectedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && this.checkDefendantOfferRejected()
      },

      onBeforeCheckPayBySetDateDefendantOfferRejectedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && this.checkDefendantOfferRejected()
      },

      onBeforeCheckPayInInstalmentsDefendantOfferRejectedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && this.checkDefendantOfferRejected()
      },

      onBeforeCheckIsClaimSettled (): boolean {
        return !!claim.moneyReceivedOn
      },

      onBeforeCheckPayBySetDatePastPaymentDeadLineDuringSettlementByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_SETTLED_THROUGH_ADMISSION) && this.checkPaymentDeadline()
      },

      onBeforeCheckPayInInstalmentsPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_ADMISSION) && this.checkPaymentDeadline()
      },

      onBeforeCheckPayBySetDatePastPaymentDeadLineDuringSettlementByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SET_DATE_SETTLED_THROUGH_DETERMINATION) && this.checkPaymentDeadline()
      },

      onBeforeCheckPayInInstalmentsPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_DETERMINATION) && this.checkPaymentDeadline()
      },

      findState (currentSate: StateMachine) {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
      },

      getTemplate (type: string): object {
        return {
          dashboard: path.join(__dirname, '../views', 'status', type, 'full-admission', this.state + '.njk'),
          state: this.state
        }
      },

      checkPaymentDeadline (): boolean {
        if (this.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          return isPastDeadline(MomentFactory.currentDateTime(),
            (claim.settlement.partyStatements.filter(o => o.type === StatementType.OFFER.value).pop().offer.completionDate))
        } else if (this.paymentOption === PaymentOption.INSTALMENTS) {
          return isPastDeadline(MomentFactory.currentDateTime(),
            (claim.settlement.partyStatements.filter(o => o.type === StatementType.OFFER.value).pop().offer.paymentIntention.repaymentPlan.firstPaymentDate))
        }

        return false
      }

    }
  })
}
