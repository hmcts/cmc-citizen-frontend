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

export function PartAdmissionTransitions (claim: Claim) {
  return new StateMachine({
    init : PartAdmissionStates.PART_ADMISSION,
    transitions : [
      {
        name : 'checkIsStatesPaid',
        from: PartAdmissionStates.PART_ADMISSION,
        to: StatesPaidStates.STATES_PAID
      },
      {
        name : 'checkIsPayImmediatelyWithMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION
      },
      {
        name : 'checkIsPayImmediatelyWithoutMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayImmediatelyAcceptedWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITH_MEDIATION
      },
      {
        name : 'checkIsPayImmediatelyAcceptedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayImmediatelyWithMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION_PAST_DEADLINE
      },
      {
        name : 'checkIsPayImmediatelyWithoutMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_ACCEPTED_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION_PAST_DEADLINE
      },
      {
        name : 'checkCCJRequestedPayImmediatelyWithMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION_PAST_DEADLINE],
        to: PartAdmissionStates.PA_CCJ_PAST_PAYMENT_DEADLINE_WITH_MEDIATION_BY_ADMISSION
      },
      {
        name : 'checkCCJRequestedPayImmediatelyWithoutMediationPastDeadLine',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION_PAST_DEADLINE],
        to: PartAdmissionStates.PA_CCJ_PAST_PAYMENT_DEADLINE_WITHOUT_MEDIATION_BY_ADMISSION
      },
      {
        name : 'checkIsPayImmediatelyRejectedWithMediationClaimantWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_REJECTED_WITH_MEDIATION_CLAIMANT_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayImmediatelyRejectedWithMediationClaimantWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_REJECTED_WITH_MEDIATION_CLAIMANT_WITH_MEDIATION
      },
      {
        name : 'checkIsPayImmediatelyRejectedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_IMMEDIATELY_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_IMMEDIATELY_REJECTED_WITHOUT_MEDIATION
      },

      {
        name : 'checkIsPayBySetDateWithMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION
      },
      {
        name : 'checkIsPayBySetDateWithoutMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayBySetDateAcceptedWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_ACCEPTED_WITH_MEDIATION
      },
      {
        name : 'checkIsPayBySetDateAcceptedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_ACCEPTED_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayBySetDateRejectedWithMediationClaimantWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_REJECTED_WITH_MEDIATION_CLAIMANT_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayBySetDateRejectedWithMediationClaimantWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SET_DATE_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_REJECTED_WITH_MEDIATION_CLAIMANT_WITH_MEDIATION
      },
      {
        name : 'checkIsPayBySetDateRejectedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SET_DATE_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_SET_DATE_REJECTED_WITHOUT_MEDIATION
      },

      {
        name : 'checkIsPayByInstallmentsWithMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION
      },
      {
        name : 'checkIsPayByInstallmentsWithoutMediation',
        from: PartAdmissionStates.PART_ADMISSION,
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayByInstallmentsAcceptedWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_ACCEPTED_WITH_MEDIATION
      },
      {
        name : 'checkIsPayByInstallmentsAcceptedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_ACCEPTED_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayByInstallmentsRejectedWithMediationClaimantWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_REJECTED_WITH_MEDIATION_CLAIMANT_WITHOUT_MEDIATION
      },
      {
        name : 'checkIsPayByInstallmentsRejectedWithMediationClaimantWithMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_REJECTED_WITH_MEDIATION_CLAIMANT_WITH_MEDIATION
      },
      {
        name : 'checkIsPayByInstallmentsRejectedWithoutMediation',
        from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITHOUT_MEDIATION],
        to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS_REJECTED_WITHOUT_MEDIATION
      }

      // {
      //   name : 'checkIsClaimSettled',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_IMMEDIATELY],
      //   to: PartAdmissionStates.PA_SETTLED_PAID_IN_FULL
      // },
      //
      // {
      //   name : 'checkIsBySpecifiedDate',
      //   from: PartAdmissionStates.PART_ADMISSION,
      //   to: PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE
      // },
      // {
      //   name : 'checkIsInstalments',
      //   from: PartAdmissionStates.PART_ADMISSION,
      //   to: PartAdmissionStates.PA_PAY_BY_INSTALMENTS
      // },
      //
      // {
      //   name : 'checkReferredToJudge',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE,PartAdmissionStates.PA_PAY_BY_INSTALMENTS],
      //   to: PartAdmissionStates.PA_REFERRED_TO_JUDGE
      // },
      //
      // {
      //   name : 'checkCCJRequestedWhenAcceptRepaymentPlanByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE,PartAdmissionStates.PA_PAY_BY_INSTALMENTS],
      //   to: PartAdmissionStates.PA_CCJ_BY_ADMISSION
      // },
      // {
      //   name : 'checkClaimantOfferAcceptedByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE,PartAdmissionStates.PA_PAY_BY_INSTALMENTS],
      //   to: PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION
      // },
      // {
      //   name : 'checkPastCounterSignatureDeadlineByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
      //   to: PartAdmissionStates.PA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      // },
      // {
      //   name : 'checkDefendantOfferRejectedByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
      //   to: PartAdmissionStates.PA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      // },
      // {
      //   name : 'checkCCJRequestedDefendantOfferRejectedByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION],
      //   to: PartAdmissionStates.PA_CCJ_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      // },
      // {
      //   name : 'checkCCJRequestedPastCounterSignatureDeadlineByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION],
      //   to: PartAdmissionStates.PA_CCJ_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      // },
      // {
      //   name : 'checkIsSettledThroughAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
      //   to: PartAdmissionStates.PA_SETTLED_THROUGH_ADMISSION
      // },
      // {
      //   name : 'checkPastPaymentDeadLineDuringSettlementByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_SETTLED_THROUGH_ADMISSION ],
      //   to: PartAdmissionStates.PA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      // },
      // {
      //   name : 'checkCCJRequestedPastPaymentDeadLineDuringSettlementByAdmission',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION],
      //   to: PartAdmissionStates.PA_CCJ_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      // },
      //
      // {
      //   name : 'checkClaimantOfferAcceptedByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE,PartAdmissionStates.PA_PAY_BY_INSTALMENTS],
      //   to: PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION
      // },
      // {
      //   name : 'checkCCJRequestedWhenAcceptRepaymentPlanByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAY_BY_SPECIFIED_DATE,PartAdmissionStates.PA_PAY_BY_INSTALMENTS],
      //   to: PartAdmissionStates.PA_CCJ_BY_DETERMINATION
      // },
      // {
      //   name : 'checkPastCounterSignatureDeadlineByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
      //   to: PartAdmissionStates.PA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      // },
      // {
      //   name : 'checkDefendantOfferRejectedByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
      //   to: PartAdmissionStates.PA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      // },
      // {
      //   name : 'checkCCJRequestedDefendantOfferRejectedByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION],
      //   to: PartAdmissionStates.PA_CCJ_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      // },
      // {
      //   name : 'checkCCJRequestedPastCounterSignatureDeadlineByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION],
      //   to: PartAdmissionStates.PA_CCJ_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      // },
      // {
      //   name : 'checkIsSettledThroughDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
      //   to: PartAdmissionStates.PA_SETTLED_THROUGH_DETERMINATION
      // },
      // {
      //   name : 'checkPastPaymentDeadLineDuringSettlementByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_SETTLED_THROUGH_DETERMINATION],
      //   to: PartAdmissionStates.PA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      // },
      // {
      //   name : 'checkCCJRequestedPastPaymentDeadLineDuringSettlementByDetermination',
      //   from: [PartAdmissionStates.PART_ADMISSION,PartAdmissionStates.PA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION ],
      //   to: PartAdmissionStates.PA_CCJ_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      // }

    ],
    data : {
      paymentOption : null,// (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption,
      log : {
        invalidTransitions : []
      }
    },
    methods: {

      onEnterState (): void {
        console.log(claim.claimNumber + '==>' + this.state)
      },

      onInvalidTransition (transition: string, from: string, to: string): void {
        this.log.invalidTransitions.push({ transition : transition,from: from,to: to })
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

      onBeforeCheckIsPayByInstallmentsWithMediation (): boolean {
        return this.paymentOption === PaymentOption.INSTALMENTS && claim.response.freeMediation === FreeMediationOption.YES
      },

      onBeforeCheckIsPayByInstallmentsWithoutMediation (): boolean {
        return this.paymentOption === PaymentOption.INSTALMENTS && claim.response.freeMediation === FreeMediationOption.NO
      },

      onBeforeCheckIsPayByInstallmentsAcceptedWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckIsPayByInstallmentsAcceptedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckIsPayByInstallmentsRejectedWithMediationClaimantWithMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.YES && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayByInstallmentsRejectedWithMediationClaimantWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITH_MEDIATION) && !!claim.claimantResponse && (claim.claimantResponse as RejectionClaimantResponse).freeMediation === FreeMediationOption.NO && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckIsPayByInstallmentsRejectedWithoutMediation (): boolean {
        return this.is(PartAdmissionStates.PA_PAY_BY_INSTALMENTS_WITHOUT_MEDIATION) && !!claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      //
      // onBeforeCheckPastCounterSignatureDeadlineByAdmission (): boolean {
      //   return this.is(PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !claim.settlement.isSettled() && !!claim.claimantRespondedAt && claim.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
      // },
      //
      // onBeforeCheckPastCounterSignatureDeadlineByDetermination (): boolean {
      //   return this.is(PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && !claim.settlement.isSettled() && !!claim.claimantRespondedAt && claim.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
      // },
      //

      //
      // onBeforeCheckCCJRequestedPastCounterSignatureDeadlineByAdmission (): boolean {
      //   return this.is(PartAdmissionStates.PA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION) && !!claim.countyCourtJudgmentRequestedAt
      // },
      //
      // onBeforeCheckCCJRequestedPastCounterSignatureDeadlineByDetermination (): boolean {
      //   return this.is(PartAdmissionStates.PA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION) && !!claim.countyCourtJudgmentRequestedAt
      // },
      //
      // onBeforeCheckCCJRequestedDefendantOfferRejectedByAdmission (): boolean {
      //   return this.is(PartAdmissionStates.PA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION) && !!claim.countyCourtJudgmentRequestedAt
      // },
      //
      // onBeforeCheckCCJRequestedDefendantOfferRejectedByDetermination (): boolean {
      //   return this.is(PartAdmissionStates.PA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION) && !!claim.countyCourtJudgmentRequestedAt
      // },
      //
      // onBeforeCheckCCJRequestedPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
      //   return this.is(PartAdmissionStates.PA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION) && !!claim.countyCourtJudgmentRequestedAt
      // },
      //
      // onBeforeCheckCCJRequestedPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
      //   return this.is(PartAdmissionStates.PA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION) && !!claim.countyCourtJudgmentRequestedAt
      // },
      //
      // onBeforeCheckCCJRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
      //   return !!claim.countyCourtJudgmentRequestedAt && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
      //     (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      // },
      //
      // onBeforeCheckCCJRequestedWhenAcceptRepaymentPlanByDetermination (): boolean {
      //   return !!claim.countyCourtJudgmentRequestedAt && !!(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
      //     (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      // },
      //
      // onBeforeCheckIsBySpecifiedDate (): boolean {
      //   return this.paymentOption === PaymentOption.BY_SPECIFIED_DATE
      // },
      //
      // onBeforeCheckIsInstalments (): boolean {
      //   return this.paymentOption === PaymentOption.INSTALMENTS
      // },
      //
      // onBeforeCheckReferredToJudge (): boolean {
      //   return !!claim.claimantResponse && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE
      // },
      //
      // onBeforeCheckClaimantOfferAcceptedByAdmission (): boolean {
      //   return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
      //          !!claim.claimantResponse && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      // },
      //
      // onBeforeCheckClaimantOfferAcceptedByDetermination (): boolean {
      //   return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
      //     !!claim.claimantResponse && !!(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      // },
      //
      // onBeforeCheckIsSettledThroughAdmission (): boolean {
      //   return this.is(PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !!claim.settlement && claim.settlement.isThroughAdmissionsAndSettled()
      // },
      //
      // onBeforeCheckIsSettledThroughDetermination (): boolean {
      //   return this.is(PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && !!claim.settlement && claim.settlement.isThroughAdmissionsAndSettled()
      // },
      //
      // onBeforeCheckDefendantOfferRejectedByAdmission (): boolean {
      //   return this.is(PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
      //     && claim.settlement && claim.settlement.isOfferRejected()
      // },
      //
      // onBeforeCheckDefendantOfferRejectedByDetermination (): boolean {
      //   return this.is(PartAdmissionStates.PA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
      //     && claim.settlement && claim.settlement.isOfferRejected()
      // },
      //
      // onBeforeCheckIsClaimSettled (): boolean {
      //   return !!claim.moneyReceivedOn
      // },
      //
      // onBeforeCheckPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
      //   return this.checkPaymentDeadline()
      // },
      //
      // onBeforeCheckPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
      //   return this.checkPaymentDeadline()
      // },

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
