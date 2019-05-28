import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import * as _ from 'lodash'
import * as path from 'path'
import { PaymentOption } from 'claims/models/paymentOption'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { MomentFactory } from 'shared/momentFactory'
import { isPastDeadline } from 'claims/isPastDeadline'
import { StatementType } from 'offer/form/models/statementType'
import { PartAdmissionStates } from 'claims/models/claim-states/part-admission-states'
import { StatesPaidStates } from 'claims/models/claim-states/states-paid-states'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { RejectionClaimantResponse } from 'claims/models/claimant-response/rejectionClaimantResponse'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'

export function PartAdmissionTransitions (claim: Claim) {
  return new StateMachine({
    init: PartAdmissionStates.PART_ADMISSION,
    transitions: [
      {
        name: 'checkIsStatesPaid',
        from: PartAdmissionStates.PART_ADMISSION,
        to: StatesPaidStates.STATES_PAID
      },
      {
        name: 'checkIsPayImmediatelyWithMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION
      },
      {
        name: 'checkIsPayImmediatelyWithoutMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayImmediatelyAcceptedWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITH_MEDIATION
      },
      {
        name: 'checkIsPayImmediatelyAcceptedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayImmediatelyWithMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION_PAST_DEADLINE
      },
      {
        name: 'checkIsPayImmediatelyWithoutMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION_PAST_DEADLINE
      },
      {
        name: 'checkCCJRequestedPayImmediatelyWithMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION_PAST_DEADLINE],
        to: PartAdmissionStates.PA_CCJ_PAST_PAYMENT_DEADLINE_WITH_MEDIATION_BY_ADMISSION
      },
      {
        name: 'checkCCJRequestedPayImmediatelyWithoutMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION_PAST_DEADLINE],
        to: PartAdmissionStates.PA_CCJ_PAST_PAYMENT_DEADLINE_WITHOUT_MEDIATION_BY_ADMISSION
      },
      {
        name: 'checkIsPayImmediatelyRejectedWithMediationClaimantWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_REJECTED_WITH_MEDIATION_CLAIMANT_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayImmediatelyRejectedWithMediationClaimantWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_REJECTED_WITH_MEDIATION_CLAIMANT_WITH_MEDIATION
      },
      {
        name: 'checkIsPayImmediatelyRejectedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_REJECTED_WITHOUT_MEDIATION
      },

      {
        name: 'checkIsPayBySetDateWithMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION
      },
      {
        name: 'checkIsPayBySetDateWithoutMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayBySetDateRejectedWithMediationClaimantWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_REJECTED_WITH_MEDIATION_CLAIMANT_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayBySetDateRejectedWithMediationClaimantWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_REJECTED_WITH_MEDIATION_CLAIMANT_WITH_MEDIATION
      },
      {
        name: 'checkIsPayBySetDateRejectedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_REJECTED_WITHOUT_MEDIATION
      },

      {
        name: 'checkIsPayInInstallmentsWithMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITH_MEDIATION
      },
      {
        name: 'checkIsPayInInstallmentsWithoutMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayInInstallmentsRejectedWithMediationClaimantWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_REJECTED_WITH_MEDIATION_CLAIMANT_WITHOUT_MEDIATION
      },
      {
        name: 'checkIsPayInInstallmentsRejectedWithMediationClaimantWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_REJECTED_WITH_MEDIATION_CLAIMANT_WITH_MEDIATION
      },
      {
        name: 'checkIsPayInInstallmentsRejectedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_REJECTED_WITHOUT_MEDIATION
      },

      {
        name: 'checkIsPayBySpecifiedDateReferredToJudge',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE],
        to: PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE_REFERRED_TO_JUDGE
      },
      {
        name: 'checkIsPayInInstalmentsReferredToJudge',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_REFERRED_TO_JUDGE
      },

      {
        name: 'checkCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_BY_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_BY_ADMISSION
      },
      {
        name: 'checkPayBySetDateClaimantOfferAcceptedByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsClaimantOfferAcceptedByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION
      },
      {
        name: 'checkPayBySetDatePastCounterSignatureDeadlineByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsPastCounterSignatureDeadlineByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkPayBySetDateDefendantOfferRejectedByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsDefendantOfferRejectedByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJPayBySetDateRequestedDefendantOfferRejectedByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedDefendantOfferRejectedByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastCounterSignatureDeadlineByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkIsPayBySetDateSettledThroughAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkIsPayInInstalmentsSettledThroughAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkPayBySetDatePastPaymentDeadLineDuringSettlementByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_SETTLED_THROUGH_ADMISSION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkPayInInstalmentsPastPaymentDeadLineDuringSettlementByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_ADMISSION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastPaymentDeadLineDuringSettlementByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastPaymentDeadLineDuringSettlementByAdmission',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },

      {
        name: 'checkPayBySetDateClaimantOfferAcceptedByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsClaimantOfferAcceptedByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_BY_DETERMINATION
      },
      {
        name: 'checkPayBySetDatePastCounterSignatureDeadlineByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsPastCounterSignatureDeadlineByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkPayBySetDateDefendantOfferRejectedByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsDefendantOfferRejectedByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedDefendantOfferRejectedByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedDefendantOfferRejectedByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastCounterSignatureDeadlineByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkIsPayBySetDateSettledThroughDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkIsPayInInstalmentsSettledThroughDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkPayBySetDatePastPaymentDeadLineDuringSettlementByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_SETTLED_THROUGH_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkPayInInstalmentsPastPaymentDeadLineDuringSettlementByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_SETTLED_THROUGH_DETERMINATION],
        to: PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkCCJPayBySetDateRequestedPastPaymentDeadLineDuringSettlementByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION],
        to: PartAdmissionStates.PA_CCJ_PAY_BY_SET_DATE_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkCCJPayInInstalmentsRequestedPastPaymentDeadLineDuringSettlementByDetermination',
        from: [PartAdmissionStates.PART_ADMISSION, PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION],
        to: PartAdmissionStates.PA_CCJ_PAY_IN_INSTALMENTS_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      }

    ],
    data: {
      paymentOption: null,// (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption,
      log: {
        invalidTransitions: []
      }
    },
    methods: {

      onInvalidTransition (transition: string, from: string, to: string): void {
        this.log.invalidTransitions.push({ transition: transition, from: from, to: to })
      },

      onBeforeCheckIsStatesPaid (): boolean {
        return !!(claim.response as PartialAdmissionResponse).paymentDeclaration
      },

      onBeforeCheckIsPayImmediatelyWithMediation (): boolean {
        this.paymentOption = (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption
        return this.paymentOption === PaymentOption.IMMEDIATELY && claim.response.freeMediation === FreeMediationOption.YES
      },

      onBeforeCheckIsPayImmediatelyWithoutMediation (): boolean {
        this.paymentOption = (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption
        return this.paymentOption === PaymentOption.IMMEDIATELY && claim.response.freeMediation === FreeMediationOption.NO
      },

      onBeforeCheckIsPayImmediatelyAcceptedWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckIsPayImmediatelyAcceptedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckIsPayImmediatelyRejectedWithMediationClaimantWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.YES && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayImmediatelyRejectedWithMediationClaimantWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.NO && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayImmediatelyRejectedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayImmediatelyWithMediationPastDeadLine (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITH_MEDIATION) &&
          (claim.response as PartialAdmissionResponse).paymentIntention.paymentDate.isBefore(MomentFactory.currentDateTime())
      },

      onBeforeCheckIsPayImmediatelyWithoutMediationPastDeadLine (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITHOUT_MEDIATION) &&
          (claim.response as PartialAdmissionResponse).paymentIntention.paymentDate.isBefore(MomentFactory.currentDateTime())
      },

      onBeforeCheckCCJRequestedPayImmediatelyWithMediationPastDeadLine (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION_PAST_DEADLINE) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedPayImmediatelyWithoutMediationPastDeadLine (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION_PAST_DEADLINE) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckIsPayBySetDateWithMediation (): boolean {
        return this.paymentOption === PaymentOption.BY_SPECIFIED_DATE && claim.response.freeMediation === FreeMediationOption.YES
      },

      onBeforeCheckIsPayBySetDateWithoutMediation (): boolean {
        return this.paymentOption === PaymentOption.BY_SPECIFIED_DATE && claim.response.freeMediation === FreeMediationOption.NO
      },

      onBeforeCheckIsPayBySetDateAcceptedWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckIsPayBySetDateAcceptedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckIsPayBySetDateRejectedWithMediationClaimantWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.YES && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayBySetDateRejectedWithMediationClaimantWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.NO && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayBySetDateRejectedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayInInstallmentsWithMediation (): boolean {
        return this.paymentOption === PaymentOption.INSTALMENTS && claim.response.freeMediation === FreeMediationOption.YES
      },

      onBeforeCheckIsPayInInstallmentsWithoutMediation (): boolean {
        return this.paymentOption === PaymentOption.INSTALMENTS && claim.response.freeMediation === FreeMediationOption.NO
      },

      onBeforeCheckIsPayInInstallmentsRejectedWithMediationClaimantWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.YES && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayInInstallmentsRejectedWithMediationClaimantWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.NO && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayInInstallmentsRejectedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayBySpecifiedDateReferredToJudge (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE) && this.checkIsReferredToJudge()
      },

      onBeforeCheckIsPayInInstalmentsReferredToJudge (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS) && this.checkIsReferredToJudge()
      },

      checkCCJRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return !!claim.countyCourtJudgmentRequestedAt && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
          (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      },

      onBeforeCheckCCJPayBySetDateRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE) && this.checkCCJRequestedWhenAcceptRepaymentPlanByAdmission()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS) && this.checkCCJRequestedWhenAcceptRepaymentPlanByAdmission()

      },

      checkClaimantOfferAcceptedByAdmission (): boolean {
        return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
          !!claim.claimantResponse && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      },

      onBeforeCheckPayBySetDateClaimantOfferAcceptedByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE) && this.checkClaimantOfferAcceptedByAdmission()
      },

      onBeforeCheckPayInInstalmentsClaimantOfferAcceptedByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS) && this.checkClaimantOfferAcceptedByAdmission()
      },

      checkDefendantOfferRejected (): boolean {
        return (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
          && claim.settlement && claim.settlement.isOfferRejected()
      },

      checkPastCounterSignatureDeadline (): boolean {
        return !claim.settlement.isSettled() && !!claim.claimantRespondedAt && claim.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
      },

      onBeforeCheckPayBySetDatePastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !this.checkDefendantOfferRejected() && this.checkClaimantOfferAcceptedByAdmission() && this.checkPastCounterSignatureDeadline()
      },

      onBeforeCheckPayInInstalmentsPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !this.checkDefendantOfferRejected() && this.checkClaimantOfferAcceptedByAdmission() && this.checkPastCounterSignatureDeadline()
      },

      onBeforeCheckPayBySetDateDefendantOfferRejectedByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && this.checkDefendantOfferRejected()
      },

      onBeforeCheckPayInInstalmentsDefendantOfferRejectedByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && this.checkDefendantOfferRejected()
      },

      onBeforeCheckCCJPayBySetDateRequestedDefendantOfferRejectedByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedDefendantOfferRejectedByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayBySetDateRequestedPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_SET_DATE_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION) && this.checkCCJRequested()
      },

      onBeforeCheckCCJPayInInstalmentsRequestedPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_IN_INSTALMENTS_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION) && this.checkCCJRequested()
      },

      findState (currentSate: StateMachine) {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
      },

      getTemplate (type: string): object {
        return {
          dashboard: path.join(__dirname, '../views', 'status', type, PartAdmissionStates.PART_ADMISSION, this.state + '.njk'),
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
