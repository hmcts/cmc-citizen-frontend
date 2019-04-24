import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import { FreeMediationOption } from 'forms/models/freeMediation'
import { DefenceType } from 'claims/models/response/defenceType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import * as _ from 'lodash'
import * as path from 'path'
import { FullDefenceStates } from 'claims/models/claim-states/full-defence-states'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'

export function fullDefenceTransitions (claim: Claim): StateMachine {
  return new StateMachine({
    init: FullDefenceStates.FULL_DEFENCE,
    transitions: [
      {
        name: 'checkAlreadyPaid',
        from: FullDefenceStates.FULL_DEFENCE,
        to: FullDefenceStates.FD_ALREADY_PAID
      },
      {
        name: 'checkAlreadyPaidResponse',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_ALREADY_PAID],
        to: FullDefenceStates.FD_ALREADY_PAID_RESPONSE
      },
      {
        name: 'checkAlreadyPaidAccept',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_ALREADY_PAID_RESPONSE],
        to: FullDefenceStates.FD_ALREADY_PAID_ACCEPT
      },
      {
        name: 'checkAlreadyPaidReject',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_ALREADY_PAID_RESPONSE],
        to: FullDefenceStates.FD_ALREADY_PAID_REJECT
      },

      {
        name: 'checkRejectWithMediation',
        from: FullDefenceStates.FULL_DEFENCE,
        to: FullDefenceStates.FD_REJECT_WITH_MEDIATION
      },
      {
        name: 'checkRejectWithoutMediation',
        from: FullDefenceStates.FULL_DEFENCE,
        to: FullDefenceStates.FD_REJECT_WITHOUT_MEDIATION
      },

      {
        name: 'checkSettlementOfferWithMediation',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_REJECT_WITH_MEDIATION],
        to: FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION
      },
      {
        name: 'checkSettlementOfferWithoutMediation',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_REJECT_WITHOUT_MEDIATION],
        to: FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION
      },

      {
        name: 'checkSettlementOfferRejectWithMediation',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION],
        to: FullDefenceStates.FD_SETTLEMENT_OFFER_REJECT_WITH_MEDIATION
      },
      {
        name: 'checkSettlementOfferRejectWithoutMediation',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION],
        to: FullDefenceStates.FD_SETTLEMENT_OFFER_REJECT_WITHOUT_MEDIATION
      },

      {
        name: 'checkSettlementOfferAcceptWithMediation',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION],
        to: FullDefenceStates.FD_MADE_AGREEMENT_WITH_MEDIATION
      },
      {
        name: 'checkSettlementOfferAcceptWithoutMediation',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION],
        to: FullDefenceStates.FD_MADE_AGREEMENT_WITHOUT_MEDIATION
      },

      {
        name: 'checkSettledByAgreement',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION, FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION, FullDefenceStates.FD_MADE_AGREEMENT_WITH_MEDIATION, FullDefenceStates.FD_MADE_AGREEMENT_WITHOUT_MEDIATION],
        to: FullDefenceStates.FD_SETTLED_WITH_AGREEMENT
      },
      {
        name: 'checkSettledByAgreement',
        from: [FullDefenceStates.FULL_DEFENCE, FullDefenceStates.FD_SETTLEMENT_OFFER_REJECT_WITHOUT_MEDIATION],
        to: FullDefenceStates.FD_SETTLED
      }
    ],
    data: {
      log: {
        invalidTransitions: []
      }
    },
    methods: {
      onInvalidTransition (transition: string, from: string, to: string): void {
        this.log.invalidTransitions.push({ transition: transition, from: from, to: to })
      },

      onBeforeCheckAlreadyPaid (): boolean {
        return (claim.response as FullDefenceResponse).defenceType === DefenceType.ALREADY_PAID
      },

      onBeforeCheckRejectWithoutMediation (): boolean {
        return claim.response.freeMediation === FreeMediationOption.NO
      },

      onBeforeCheckRejectWithMediation (): boolean {
        return claim.response.freeMediation === FreeMediationOption.YES
      },

      onBeforeCheckAlreadyPaidResponse (): boolean {
        return !!claim.claimantResponse
          && !!claim.claimantResponse.type
          && !!(claim.response as FullDefenceResponse).paymentDeclaration
          && (claim.claimantResponse.type === ClaimantResponseType.REJECTION || claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION)
      },

      onBeforeCheckAlreadyPaidAccept (): boolean {
        return this.state === FullDefenceStates.FD_ALREADY_PAID_RESPONSE && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckAlreadyPaidReject (): boolean {
        return this.state === FullDefenceStates.FD_ALREADY_PAID_RESPONSE && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckSettlementOfferWithMediation (): boolean {
        return this.state === FullDefenceStates.FD_REJECT_WITH_MEDIATION && !!claim.settlement && !claim.settlement.isThroughAdmissions() && !this.moneyReceivedOn
      },

      onBeforeCheckSettlementOfferWithoutMediation (): boolean {
        return this.state === FullDefenceStates.FD_REJECT_WITHOUT_MEDIATION && !!claim.settlement && !claim.settlement.isThroughAdmissions() && !this.moneyReceivedOn
      },

      onBeforeCheckSettlementOfferRejectWithMediation (): boolean {
        return this.state === FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION && claim.settlement.isOfferRejected() && !claim.settlementReachedAt
      },

      onBeforeCheckSettlementOfferRejectWithoutMediation (): boolean {
        return this.state === FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION && claim.settlement.isOfferRejected() && !claim.settlementReachedAt
      },

      onBeforeCheckSettlementOfferAcceptWithMediation (): boolean {
        return this.state === FullDefenceStates.FD_SETTLEMENT_OFFER_WITH_MEDIATION && claim.settlement.isOfferAccepted() && !claim.settlementReachedAt
      },

      onBeforeCheckSettlementOfferAcceptWithoutMediation (): boolean {
        return this.state === FullDefenceStates.FD_SETTLEMENT_OFFER_WITHOUT_MEDIATION && claim.settlement.isOfferAccepted() && !claim.settlementReachedAt
      },

      onBeforeCheckSettledByAgreement (): boolean {
        return this.state !== FullDefenceStates.FULL_DEFENCE && claim.settlement && !!claim.settlementReachedAt
      },

      findState (currentSate: StateMachine): void {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
      },

      getTemplate (type: string): object {
        return {
          dashboard: path.join(__dirname, '../views', 'status', type, FullDefenceStates.FULL_DEFENCE, this.state + '.njk'),
          state: this.state
        }
      }

    }
  })
}
