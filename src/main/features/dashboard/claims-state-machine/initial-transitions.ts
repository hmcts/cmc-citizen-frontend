import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import { ResponseType } from 'claims/models/response/responseType'
import { isPastDeadline } from 'claims/isPastDeadline'
import { MomentFactory } from 'shared/momentFactory'

import * as _ from 'lodash'
import * as path from 'path'
import { InitialStates } from 'claims/models/claim-states/initial-states'
import { FullDefenceStates } from 'claims/models/claim-states/full-defence-states'

export function initialTransitions (claim: Claim): StateMachine {
  return new StateMachine({
    init: 'init',
    transitions: [

      {
        name: 'checkNoResponse',
        from: InitialStates.INIT,
        to: InitialStates.NO_RESPONSE
      },
      {
        name: 'checkMoreTimeRequested',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE],
        to: InitialStates.MORE_TIME_REQUESTED
      },
      {
        name: 'checkFullGrant',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_AWAITING_RESPONSE_HWF],
        to: InitialStates.HWF_Part_Remitted
      },
      {
        name: 'checkCCJEnabled',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.MORE_TIME_REQUESTED],
        to: InitialStates.NO_RESPONSE_PAST_DEADLINE
      },
      {
        name: 'checkIsFullDefence',
        from: [InitialStates.INIT],
        to: FullDefenceStates.FULL_DEFENCE
      },
      {
        name: 'checkHwf',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE],
        to: InitialStates.HWF_APPLICATION_PENDING
      },
      {
        name: 'checkHwfIntrestReCalculate',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_AWAITING_RESPONSE_HWF],
        to: InitialStates.HWF_Intrest_Recalculate
      },
      {
        name: 'checkHwfFeesReject',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_AWAITING_RESPONSE_HWF],
        to: InitialStates.HWF_Rejected
      },
      {
        name: 'checkHwfFeesMoreInfo',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_AWAITING_RESPONSE_HWF],
        to: InitialStates.HWF_More_Info
      },
      {
        name: 'checkHwfFeesApplicationClosed',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_AWAITING_RESPONSE_HWF],
        to: InitialStates.HWF_CLOSED
      },
      {
        name: 'checkHwfPartRemitted',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_AWAITING_RESPONSE_HWF],
        to: InitialStates.HWF_Part_Remitted
      },
      {
        name: 'checkHwfInvalid',
        from: [InitialStates.INIT, InitialStates.NO_RESPONSE, InitialStates.HWF_APPLICATION_PENDING],
        to: InitialStates.HWF_INVALID_REFERENCE
      }
    ],
    data: {
      log: {
        invalidTransitions: []
      }
    },
    methods: {

      onInvalidTransition (transition: string, from: string, to: string) {
        this.log.invalidTransitions.push({ transition: transition, from: from, to: to })
      },

      onBeforeCheckNoResponse () {
        return !claim.response
      },

      onBeforeCheckMoreTimeRequested () {
        return this.state !== 'init' && claim.moreTimeRequested
      },

      onBeforeCheckIsFullDefence () {
        return (claim.response.responseType && claim.response.responseType === ResponseType.FULL_DEFENCE)
      },

      onBeforeCheckCCJEnabled () {
        return this.state !== 'init' && isPastDeadline(MomentFactory.currentDateTime(), claim.responseDeadline)
      },

      onBeforeCheckHwf () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'HWF_APPLICATION_PENDING' && (claim.lastEventTriggeredForHwfCase === 'CreateHelpWithFeesClaim' || claim.lastEventTriggeredForHwfCase === 'UpdateHWFNumber')
      },

      onBeforeCheckHwfIntrestReCalculate () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'AWAITING_RESPONSE_HWF' && claim.lastEventTriggeredForHwfCase === 'RecalculateInterest'
      },

      onBeforeCheckHwfFeesReject () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'AWAITING_RESPONSE_HWF' && claim.lastEventTriggeredForHwfCase === 'NoRemissionHWF'
      },

      onBeforeCheckHwfFeesMoreInfo () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'AWAITING_RESPONSE_HWF' && claim.lastEventTriggeredForHwfCase === 'MoreInfoRequiredForHWF'
      },

      onBeforeCheckHwfFeesApplicationClosed () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'CLOSED_HWF'
      },

      onBeforeCheckHwfPartRemitted () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'AWAITING_RESPONSE_HWF' && claim.lastEventTriggeredForHwfCase === 'HWFPartRemission'
      },

      onBeforeCheckFullGrant () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'AWAITING_RESPONSE_HWF' && claim.lastEventTriggeredForHwfCase === 'HWFFullRemision'
      },

      onBeforeCheckHwfInvalid () {
        return !claim.response && claim.helpWithFeesNumber !== null && claim.state === 'AWAITING_RESPONSE_HWF' && claim.lastEventTriggeredForHwfCase === 'InvalidHWFReference'
      },

      findState (currentSate: StateMachine) {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
      },

      getTemplate (type: string): object {
        return {
          dashboard: path.join(__dirname, '../views', 'status', type, this.state + '.njk'),
          state: this.state
        }
      }

    }
  })
}
