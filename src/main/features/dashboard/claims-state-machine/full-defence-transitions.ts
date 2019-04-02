
import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import { FreeMediationOption } from 'forms/models/freeMediation'
import { DefenceType } from 'claims/models/response/defenceType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import * as _ from 'lodash'
import * as path from 'path'

export function FullDefenceTransitions (claim: Claim) {
  return new StateMachine({
    init : 'full-defence',
    transitions : [

      { name : 'checkAlreadyPaid', from: 'full-defence', to: 'fd-already-paid' },
      { name : 'checkAlreadyPaidResponse', from: ['full-defence','fd-already-paid'], to: 'fd-already-paid-response' },
      { name : 'checkAlreadyPaidAccept', from: ['full-defence','fd-already-paid-response'], to: 'fd-already-paid-accept' },
      { name : 'checkAlreadyPaidReject', from: ['full-defence','fd-already-paid-response'], to: 'fd-already-paid-reject' },

      { name : 'checkRejectWithMediation', from: 'full-defence', to: 'fd-reject-with-mediation' },
      { name : 'checkRejectWithoutMediation', from: 'full-defence', to: 'fd-reject-without-mediation' },

      { name : 'checkSettlementOfferWithMediation', from: ['full-defence', 'fd-reject-with-mediation'], to: 'fd-settlement-offer-with-mediation' },
      { name : 'checkSettlementOfferWithoutMediation', from: ['full-defence', 'fd-reject-without-mediation'], to: 'fd-settlement-offer-without-mediation' },

      { name : 'checkSettlementOfferRejectWithMediation', from: ['full-defence', 'fd-settlement-offer-with-mediation'], to: 'fd-settlement-offer-reject-with-mediation' },
      { name : 'checkSettlementOfferRejectWithoutMediation', from: ['full-defence', 'fd-settlement-offer-without-mediation'], to: 'fd-settlement-offer-reject-without-mediation' },

      { name : 'checkSettlementOfferAcceptWithMediation', from: ['full-defence', 'fd-settlement-offer-with-mediation'], to: 'fd-made-agreement-with-mediation' },
      { name : 'checkSettlementOfferAcceptWithoutMediation', from: ['full-defence', 'fd-settlement-offer-without-mediation'], to: 'fd-made-agreement-without-mediation' },

      { name : 'checkSettledByAgreement', from: ['full-defence', 'fd-settlement-offer-with-mediation','fd-settlement-offer-without-mediation', 'fd-made-agreement-with-mediation','fd-made-agreement-without-mediation'], to: 'fd-settled-with-agreement' },
      { name : 'checkSettledByAgreement', from: ['full-defence', 'fd-settlement-offer-reject-without-mediation'], to: 'fd-settled' }
    ],
    methods: {

      onInvalidTransition (transition: string, from: string, to: string): void {
        // When the transaction is not allowed then state is going to remain same
      },

      onBeforeCheckAlreadyPaid (): boolean {
        return claim.response.defenceType === DefenceType.ALREADY_PAID
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
          && !!claim.response.paymentDeclaration
          && (claim.claimantResponse.type === ClaimantResponseType.REJECTION || claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION)
      },

      onBeforeCheckAlreadyPaidAccept (): boolean {
        return this.state === 'fd-already-paid-response' && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
      },

      onBeforeCheckAlreadyPaidReject (): boolean {
        return this.state === 'fd-already-paid-response' && claim.claimantResponse.type === ClaimantResponseType.REJECTION
      },

      onBeforeCheckSettlementOfferWithMediation (): boolean {
        return this.state === 'fd-reject-with-mediation' && !!claim.settlement && !claim.settlement.isThroughAdmissions() && !this.moneyReceivedOn
      },

      onBeforeCheckSettlementOfferWithoutMediation (): boolean {
        return this.state === 'fd-reject-without-mediation' && !!claim.settlement && !claim.settlement.isThroughAdmissions() && !this.moneyReceivedOn
      },

      onBeforeCheckSettlementOfferRejectWithMediation (): boolean {
        return this.state === 'fd-settlement-offer-with-mediation' && claim.settlement.isOfferRejected() && !claim.settlementReachedAt
      },

      onBeforeCheckSettlementOfferRejectWithoutMediation (): boolean {
        return this.state === 'fd-settlement-offer-without-mediation' && claim.settlement.isOfferRejected() && !claim.settlementReachedAt
      },

      onBeforeCheckSettlementOfferAcceptWithMediation (): boolean {
        return this.state === 'fd-settlement-offer-with-mediation' && claim.settlement.isOfferAccepted() && !claim.settlementReachedAt
      },

      onBeforeCheckSettlementOfferAcceptWithoutMediation (): boolean {
        return this.state === 'fd-settlement-offer-without-mediation' && claim.settlement.isOfferAccepted() && !claim.settlementReachedAt
      },

      onBeforeCheckSettledByAgreement (): boolean {
        return this.state !== 'full-defence' && claim.settlement && !!claim.settlementReachedAt
      },

      findState (currentSate: StateMachine): void {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
      },

      getTemplate (type: string) {
        return {
          dashboard: path.join(__dirname, '../views', 'status', type, 'full-defence', this.state + '.njk'),
          state: this.state
        }
      }

    }
  })
}
