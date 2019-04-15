
import * as StateMachine from '@taoqf/javascript-state-machine'
import { Claim } from 'claims/models/claim'

import { ResponseType } from 'claims/models/response/responseType'
import { isPastDeadline } from 'claims/isPastDeadline'
import { MomentFactory } from 'shared/momentFactory'
import * as _ from 'lodash'
import * as path from 'path'

export function InitialTransitions (claim: Claim) {
  return new StateMachine({
    init : 'init',
    transitions : [

      { name : 'checkNoResponse', from: 'init', to: 'no-response' },
      { name : 'checkMoreTimeRequested', from: ['init', 'no-response'], to: 'more-time-requested' },
      { name : 'checkCCJEnabled', from: ['init', 'no-response','more-time-requested'], to: 'no-response-past-deadline' },

      { name : 'checkIsFullAdmission',from: ['init'], to: 'full-admission' },
      { name : 'checkIsPartAdmission',from: ['init'], to: 'part-admission' }

    ],
    methods: {

      onInvalidTransition (transition: string, from: string, to: string) {
        // When the transaction is not allowed then state is going to remain same
      },

      onBeforeCheckNoResponse () {
        return !claim.response
      },

      onBeforeCheckMoreTimeRequested () {
        return this.state !== 'init' && claim.moreTimeRequested
      },

      onBeforeCheckIsFullAdmission () {
        return (claim.response.responseType && claim.response.responseType === ResponseType.FULL_ADMISSION)
      },

      onBeforeCheckIsPartAdmission (): boolean {
        return (claim.response.responseType && claim.response.responseType === ResponseType.PART_ADMISSION)
      },

      onBeforeCheckCCJEnabled () {
        return this.state !== 'init' && isPastDeadline(MomentFactory.currentDateTime(), claim.responseDeadline)
      },

      findState (currentSate: StateMachine) {
        _.each(currentSate.transitions(), function (eachTransaction) {
          currentSate[eachTransaction]()
        })
      },

      getTemplate (type: string) {
        return {
          dashboard: path.join(__dirname, '../views', 'status', type, this.state + '.njk'),
          state: this.state
        }
      }

    }
  })
}
