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
        name: 'checkCCJRequestedWhenAcceptRepaymentPlanByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_CCJ_BY_ADMISSION
      },
      {
        name: 'checkClaimantOfferAcceptedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION
      },
      {
        name: 'checkPastCounterSignatureDeadlineByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkDefendantOfferRejectedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJRequestedDefendantOfferRejectedByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION
      },
      {
        name: 'checkCCJRequestedPastCounterSignatureDeadlineByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION
      },
      {
        name: 'checkIsSettledThroughAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION],
        to: FullAdmissionStates.FA_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkPastPaymentDeadLineDuringSettlementByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_SETTLED_THROUGH_ADMISSION],
        to: FullAdmissionStates.FA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },
      {
        name: 'checkCCJRequestedPastPaymentDeadLineDuringSettlementByAdmission',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION],
        to: FullAdmissionStates.FA_CCJ_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION
      },

      {
        name: 'checkClaimantOfferAcceptedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION
      },
      {
        name: 'checkCCJRequestedWhenAcceptRepaymentPlanByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE, FullAdmissionStates.FA_PAY_IN_INSTALMENTS],
        to: FullAdmissionStates.FA_CCJ_BY_DETERMINATION
      },
      {
        name: 'checkPastCounterSignatureDeadlineByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkDefendantOfferRejectedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJRequestedDefendantOfferRejectedByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION
      },
      {
        name: 'checkCCJRequestedPastCounterSignatureDeadlineByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION
      },
      {
        name: 'checkIsSettledThroughDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION],
        to: FullAdmissionStates.FA_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkPastPaymentDeadLineDuringSettlementByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_SETTLED_THROUGH_DETERMINATION],
        to: FullAdmissionStates.FA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      },
      {
        name: 'checkCCJRequestedPastPaymentDeadLineDuringSettlementByDetermination',
        from: [FullAdmissionStates.FULL_ADMISSION, FullAdmissionStates.FA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION],
        to: FullAdmissionStates.FA_CCJ_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION
      }

    ],
    data: {
      paymentOption: (claim.response as FullAdmissionResponse).paymentIntention.paymentOption,
      log: {
        invalidTransitions: []
      }
    },
    methods: {

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

      onBeforeCheckPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !claim.settlement.isSettled() && !!claim.claimantRespondedAt && claim.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
      },

      onBeforeCheckPastCounterSignatureDeadlineByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && !claim.settlement.isSettled() && !!claim.claimantRespondedAt && claim.claimantRespondedAt.clone().add('7', 'days').isBefore(MomentFactory.currentDate())
      },

      onBeforeCheckCCJRequestedPayImmediatelyPastDeadLine (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IMMEDIATELY_PAST_DEADLINE) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedPastCounterSignatureDeadlineByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_ADMISSION) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedPastCounterSignatureDeadlineByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAST_COUNTER_SIGNATURE_DEADLINE_BY_DETERMINATION) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedDefendantOfferRejectedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_ADMISSION) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedDefendantOfferRejectedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_DEFENDANT_REJECTED_CLAIMANT_OFFER_BY_DETERMINATION) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_ADMISSION) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_PAST_PAYMENT_DEADLINE_SETTLED_THROUGH_DETERMINATION) && !!claim.countyCourtJudgmentRequestedAt
      },

      onBeforeCheckCCJRequestedWhenAcceptRepaymentPlanByAdmission (): boolean {
        return !!claim.countyCourtJudgmentRequestedAt && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
          (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      },

      onBeforeCheckCCJRequestedWhenAcceptRepaymentPlanByDetermination (): boolean {
        return !!claim.countyCourtJudgmentRequestedAt && !!(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination &&
          (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.CCJ
      },

      onBeforeCheckIsBySpecifiedDate (): boolean {
        return this.paymentOption === PaymentOption.BY_SPECIFIED_DATE
      },

      onBeforeCheckIsInstalments (): boolean {
        return this.paymentOption === PaymentOption.INSTALMENTS
      },

      onBeforeCheckIsPayBySpecifiedDateReferredToJudge (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_BY_SPECIFIED_DATE) && !!claim.claimantResponse && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE
      },

      onBeforeCheckIsPayInInstalmentsReferredToJudge (): boolean {
        return this.is(FullAdmissionStates.FA_PAY_IN_INSTALMENTS) && !!claim.claimantResponse && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.REFER_TO_JUDGE
      },

      onBeforeCheckClaimantOfferAcceptedByAdmission (): boolean {
        return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
          !!claim.claimantResponse && !(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      },

      onBeforeCheckClaimantOfferAcceptedByDetermination (): boolean {
        return !!claim.settlement && claim.settlement.isOfferAccepted() && claim.settlement.isThroughAdmissions() &&
          !!claim.claimantResponse && !!(claim.claimantResponse as AcceptationClaimantResponse).courtDetermination
      },

      onBeforeCheckIsSettledThroughAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && !!claim.settlement && claim.settlement.isThroughAdmissionsAndSettled()
      },

      onBeforeCheckIsSettledThroughDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && !!claim.settlement && claim.settlement.isThroughAdmissionsAndSettled()
      },

      onBeforeCheckDefendantOfferRejectedByAdmission (): boolean {
        return this.is(FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_ADMISSION) && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
          && claim.settlement && claim.settlement.isOfferRejected()
      },

      onBeforeCheckDefendantOfferRejectedByDetermination (): boolean {
        return this.is(FullAdmissionStates.FA_CLAIMANT_OFFER_ACCEPTED_BY_DETERMINATION) && (claim.claimantResponse as AcceptationClaimantResponse).formaliseOption === FormaliseOption.SETTLEMENT
          && claim.settlement && claim.settlement.isOfferRejected()
      },

      onBeforeCheckIsClaimSettled (): boolean {
        return !!claim.moneyReceivedOn
      },

      onBeforeCheckPastPaymentDeadLineDuringSettlementByAdmission (): boolean {
        return this.checkPaymentDeadline()
      },

      onBeforeCheckPastPaymentDeadLineDuringSettlementByDetermination (): boolean {
        return this.checkPaymentDeadline()
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
