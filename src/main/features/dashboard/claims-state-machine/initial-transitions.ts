import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import { ResponseType } from 'claims/models/response/responseType'
import { isPastDeadline } from 'claims/isPastDeadline'
import { MomentFactory } from 'shared/momentFactory'

import * as _ from 'lodash'
import * as path from 'path'
import { InitialStates } from 'claims/models/claim-states/initial-states'
import { FullDefenceStates } from 'claims/models/claim-states/full-defence-states'

function noResponse (claim): StateMachine {
  return new StateMachine({
    init: InitialStates.NO_RESPONSE,
    transitions: [
      {
        name: 'checkMoreTimeRequested',
        from: [InitialStates.NO_RESPONSE],
        to: InitialStates.MORE_TIME_REQUESTED
      },
      {
        name: 'checkCCJEnabled',
        from: [InitialStates.NO_RESPONSE, InitialStates.MORE_TIME_REQUESTED],
        to: InitialStates.NO_RESPONSE_PAST_DEADLINE
      }
    ],
    methods: {
      onBeforeCheckMoreTimeRequested () {
        return !claim.moreTimeRequested
      },

      onBeforeCheckCCJEnabled () {
        return isPastDeadline(MomentFactory.currentDateTime(), claim.responseDeadline)
      }
    }
  })
}

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
        name: 'checkIsFullDefence',
        from: [InitialStates.INIT],
        to: FullDefenceStates.FULL_DEFENCE
      }
    ],
    data: {
      log: {
        invalidTransitions: []
      },
      noResponse: noResponse(claim)
    },
    methods: {

      onInvalidTransition (transition: string, from: string, to: string) {
        this.log.invalidTransitions.push({ transition: transition, from: from, to: to })
      },

      onBeforeCheckNoResponse () {
        if (!claim.response) {
          let noRepsonse = this.noResponse

          _.each(noRepsonse.transitions(), function (eachTransaction) {
            noRepsonse[eachTransaction]()
          })
        }

        return !claim.response
      },

      onBeforeCheckIsFullDefence () {
        return (claim.response.responseType && claim.response.responseType === ResponseType.FULL_DEFENCE)
      },

      onBeforeCheckCCJEnabled () {
        return this.state !== 'init' && isPastDeadline(MomentFactory.currentDateTime(), claim.responseDeadline)
      },

      findState (currentSate: StateMachine) {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
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
